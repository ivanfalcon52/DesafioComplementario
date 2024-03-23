const express = require ("express");
const app = express();
const PUERTO = 4000;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require ("./routes/views.routes.js");
const exphbs = require ("express-handlebars");
const socket = require ("socket.io");
require("./database.js")

//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//LE DIGO A EXPRESS QUE RECIBO ARCHIVOS EN FORMATO JSON.
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

//RUTAS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/",viewsRouter);

//LISTEN DEL SERVIDOR
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`);
})

const MessageModel = require ("./models/message.model.js");

const io = new socket.Server(httpServer); 


io.on("connection", (socket) => {
    console.log("Un cliente conectado");

    socket.on("message", async (data) => {
        
        await MessageModel.create(data);

        const messages = await MessageModel.find();
        io.sockets.emit("message",messages)
    })
} )