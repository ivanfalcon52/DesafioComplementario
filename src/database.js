//Vamos a conectar MongoDB

//1) Instalamos mongoose: npm i mongoose

const mongoose = require("mongoose");

//2) Crear una conexion con la base de datos

mongoose.connect("mongodb+srv://ivanfalcon52:Dangerous52@ivanf.unxtpmi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=IvanF")
    .then(() => console.log("conexion exitosa"))
    .catch((error) => console.log("Error en la conexion", error))