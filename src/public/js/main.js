const socket = io()

const formNewProduct = document.getElementById("formNewProduct")
const formDeleteProduct = document.getElementById("formDeleteProduct")

formNewProduct.addEventListener("submit", (e) => {
    e.preventDefault()

    let title = document.getElementById("title").value
    let description = document.getElementById("description").value
    let price = parseInt(document.getElementById("price").value)
    let thumbnail = document.getElementById("thumbnail").value
    let code = document.getElementById("code").value
    let stock = document.getElementById("stock").value
    let category = document.getElementById("category").value

    const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
    }

    socket.emit("newProduct", newProduct)

    formNewProduct.reset()

})