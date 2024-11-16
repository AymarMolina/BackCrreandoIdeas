
const pool = require('../database/conf');
const obtenerProductos = async () => {
    try {
        const query = `
            SELECT 
                p.id AS id,
                p.nombre AS nombre,
                p.descripcion,
                p.precio,
                p.categoria,
                (
                    SELECT url_imagen 
                    FROM imagenes_producto ip 
                    WHERE ip.producto_id = p.id 
                    LIMIT 1
                ) AS imagen_url
            FROM 
                productos p
            ORDER BY 
                p.id;
        `;

        const result = await pool.query(query);

       
        const productos = result.rows.map(producto => ({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion, 
            precio: parseFloat(producto.precio), 
            categoria: producto.categoria,
            imagen_url: producto.imagen_url || null 
        }));

        return productos;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};
  
const obtenerProductoPorId = async (idProducto) => {
  try {
      const query = `
          SELECT 
              p.id AS id,
              p.nombre AS nombre,
              p.descripcion,
              p.precio,
              p.categoria,
              vp.id,
              vp.color,
              vp.talla,
              vp.stock_disponible,
              (vp.stock_disponible + COALESCE(SUM(dv.cantidad), 0)) AS stock_inicial,
              COALESCE(SUM(dv.cantidad), 0) AS productos_vendidos,
              (vp.stock_disponible) AS tickets_restantes,
              ip.url_imagen AS imagen_general,
              iv.url_imagen AS imagen_variante,
              iv.descripcion AS imagen_descripcion
          FROM 
              productos p
          LEFT JOIN 
              variantes_producto vp ON p.id = vp.producto_id
          LEFT JOIN 
              imagenes_producto ip ON p.id = ip.producto_id
          LEFT JOIN 
              imagenes_variantes iv ON vp.id = iv.variante_id
          LEFT JOIN 
              detalles_venta dv ON vp.id = dv.variacion_id
          WHERE 
              p.id = $1
          GROUP BY 
              p.id, p.nombre, p.descripcion, p.precio, p.categoria, 
              vp.id, vp.color, vp.talla, vp.stock_disponible,
              ip.url_imagen,
              iv.id, iv.url_imagen, iv.descripcion
          ORDER BY 
              vp.id, iv.id;
      `; 

      const result = await pool.query(query, [idProducto]);

      if (result.rows.length === 0) {
          return null; 
      }

      
      const producto = {
          id: result.rows[0].id,
          nombre: result.rows[0].nombre,
          descripcion: result.rows[0].descripcion,
          precio: parseFloat(result.rows[0].precio),
          categoria: result.rows[0].categoria,
          imagenGeneral: result.rows[0].imagen_general,
          variantes: []
      };

      const variantesMap = new Map();

      result.rows.forEach(row => {
          const key = `${row.color || ''}-${row.talla || ''}`;
          
         
          if (!variantesMap.has(key)) {
              variantesMap.set(key, {
                  id:row.id,
                  color: row.color,
                  talla: row.talla, 
                  stock_inicial: row.stock_inicial,
                  productos_vendidos: row.productos_vendidos, 
                  tickets_restantes: row.tickets_restantes,
                  imagenes: [],
              });
          }
 
          
          if (row.imagen_variante) {
              variantesMap.get(key).imagenes.push({
                  url: row.imagen_variante,
                  descripcion: row.imagen_descripcion || null,
              });
          }
      });

      
      producto.variantes = Array.from(variantesMap.values());

      return producto;
  } catch (error) {
      console.error('Error al obtener producto con variantes:', error);
      throw error;
  }
};


  
  

const agregarProducto = async (nombre, descripcion, precio, categoria) => {
  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, categoria, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [nombre, descripcion, precio, categoria]
    );
    return result.rows[0];  
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
};

const actualizarProducto = async (id, nombre, descripcion, precio, categoria) => {
  try {
    const result = await pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, categoria = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [nombre, descripcion, precio, categoria, id]
    );
    return result.rows[0]; 
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

const eliminarProducto = async (id) => {
  try {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];  
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};
const obtenerVariacionesPorProducto = async (productoId) => {
    try {
      const query = `
        SELECT 
          p.id AS producto_id, 
          p.nombre AS producto_nombre,
          p.descripcion,
          p.precio,
          vp.color,
          vp.talla,
          vp.stock_disponible
        FROM 
          productos p
        JOIN 
          variaciones_producto vp ON p.id = vp.producto_id
        WHERE 
          p.id = $1
        ORDER BY 
          vp.color, vp.talla;
      `;
      const result = await pool.query(query, [productoId]);
      return result.rows;  
    } catch (error) {
      console.error('Error al obtener variaciones de producto:', error);
      throw error;
    }
  };

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerVariacionesPorProducto
};
