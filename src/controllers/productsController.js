const productService = require('../services/productsService');


const obtenerProductos = async (req, res) => {
  try {
    const productos = await productService.obtenerProductos();
    res.status(200).json(productos); 
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productService.obtenerProductoPorId(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);  
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};


const agregarProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;
  try {
    const producto = await productService.agregarProducto(nombre, descripcion, precio, categoria);
    res.status(201).json(producto);  
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
};


const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria } = req.body;
  try {
    const producto = await productService.actualizarProducto(id, nombre, descripcion, precio, categoria);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);  
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};


const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productService.eliminarProducto(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
const obtenerVariacionesDeProducto = async (req, res) => {
    const { id } = req.params;  
    try {
      const variaciones = await productService.obtenerVariacionesPorProducto(id);
      if (variaciones.length === 0) {
        return res.status(404).json({ error: 'No se encontraron variaciones para este producto' });
      }
      res.status(200).json(variaciones);  
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las variaciones de producto' });
    }
  };

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerVariacionesDeProducto,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
};
