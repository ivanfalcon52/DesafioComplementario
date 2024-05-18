const socket = require("socket.io")
const MessageModel = require("../models/message.model.js");
const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository

class Socket {
    constructor(httpServer) {
        this.io = socket(httpServer)
        this.initSocketEvents()
    }

    async initSocketEvents() {

        this.io.on("connection", (socket) => {

            console.log("Cliente Conectado")

            socket.on("newProduct", async (data) => {
                try {
                    await productRepository.addProduct(data)
                    socket.emit("success", { message: "Producto Agregado Correctamente" })
                    const products = await productRepository.getProducts()
                    socket.emit("products", products)
                } catch (error) {
                    socket.emit("error", error.message)
                }
            })

            socket.on("deleteProduct", async (data) => {
                try {
                    await productRepository.deleteProduct(data)
                    socket.emit("success", { message: `Producto con id: ${data} borrado de forma correcta` })
                    const products = await productRepository.getProducts()
                    socket.emit("products", products)
                } catch (error) {
                    socket.emit("error", error.message)
                }
            })

            socket.on("message", async data => {
                try {
                    await MessageModel.create(data)
                    const messages = await MessageModel.find()
                    socket.emit("message", messages)
                } catch (error) {
                    socket.emit("error", error.message)
                }
            })

            socket.on("disconnect", () => {
                console.log("Cliente Desconectado")
            })
        })
    }

}








module.exports = Socket