const express = require('express');
const productController = require('../../controllers/productsController');
const router = express.Router();

router.get('/', productController.obtenerProductos);               
router.get('/:id', productController.obtenerProductoPorId);      
router.post('/', productController.agregarProducto);              
router.put('/:id', productController.actualizarProducto);       
router.delete('/:id', productController.eliminarProducto);
 
router.get('/:id/variaciones', productController.obtenerVariacionesDeProducto);      

module.exports = router;   
   