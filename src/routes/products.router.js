const ProductModel = require ("../models/product.model.js");
const express = require("express");
const router= express.Router();
const ProductManager= require ("../controllers/product-manager");
const productManager = new ProductManager();

//La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior)

router.get("/", async (req, res) => {
    
    
    
    try{
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const sort = req.query.sort || "";
        const query = req.query.query || "";
        
        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });
    }
    catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})

//La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(id);
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//RUTA RAIZ POST:

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;
    
    try {
        await productManager.addProduct(nuevoProducto);

        res.status(201).json ({ status: "success", message: "Producto creado exitosamente" });
    } catch (error) {
        res.status(404).send({ status: "error", message: "Error producto no creado" });
    }
});

//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado);
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


//La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});



//EXPORTACION DEL MODULO
module.exports = router;