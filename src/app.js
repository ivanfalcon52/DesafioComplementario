const express = require ("express");
const app = express();
const PUERTO = 4000;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require ("./routes/views.router.js");
const exphbs = require ("express-handlebars");
const socket = require ("socket.io");
require("./database.js");
const session = require ("express-session");//npm i express session
//const FileStore = require ("session-file-store");//npm i session-file-store
const MongoStore = require ("connect-mongo");//npm install connect-mongo
const sessionsRouter = require ("./routes/sessions.router.js");


//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//LE DIGO A EXPRESS QUE RECIBO ARCHIVOS EN FORMATO JSON. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

//MIDDLEWARE DE SESSION:
//Middleware de Session: 
app.use(session({
    secret:"secretCoder",
    resave: true,
    //Esta configuración me permite mantener activa la sesion frente a la inactividad del usuario. 

    saveUninitialized: true,
    //Me permite guardar cualquier sesión aun cuando el objeto de sesion no tenga nada para contener. 
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://ivanfalcon52:Dangerous52@ivanf.unxtpmi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=IvanF", ttl: 1000
    })
}))
//RUTAS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
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