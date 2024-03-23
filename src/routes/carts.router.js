const express = require("express");
const router= express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager();
const CartModel = require ("../models/cart.model.js");


//1) Creamos un nuevo carrito: 

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//2) Listamos los productos que pertenecen a determinado carrito. 

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//3) Agregar productos a distintos carritos.

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
///////////////2DA ENTREGA//////////////


// eliminar del carrito un producto seleccionado:

router.delete("/api/carts/:cid/products/:pid", async (res,req)=>{
    try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const actualizarCart = await cartManager.eliminarProductoDelCarrito(cartId, productId);

    res.json({
        status: 'success',
        message: 'Producto eliminado del carrito correctamente',
        actualizarCart,
    })
    } catch (error) {
        console.error("Error al eliminar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})


//actualizamos con un arreglo de productos con el formato de arriba
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    // Debes enviar un arreglo de productos en el cuerpo de la solicitud

    try {
        const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//7) DELETE api/carts/:cid deberá eliminar todos los productos del carrito 


router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.vaciarCarrito(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});




//EXPORTACION DEL MODULO
module.exports = router;