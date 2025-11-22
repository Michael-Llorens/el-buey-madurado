import Product from "../models/Product.js";

// Crear un producto nuevo
export const crearProducto = async (req, res) => {
  try {
    const producto = new Product(req.body);
    await producto.save();
    res.status(201).json({
      message: "✅ Producto creado correctamente",
      producto,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error al crear el producto",
      error: error.message,
    });
  }
};

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.find().populate("ingredients");
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      message: "❌ Error al obtener productos",
      error: error.message,
    });
  }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        message: "❌ Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      message: "❌ Error al obtener el producto",
      error: error.message,
    });
  }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // para devolver el actualizado
    );

    if (!productoActualizado) {
      return res.status(404).json({
        message: "❌ Producto no encontrado",
      });
    }

    res.json({
      message: "✅ Producto actualizado correctamente",
      producto: productoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error al actualizar el producto",
      error: error.message,
    });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Product.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({
        message: "❌ Producto no encontrado",
      });
    }

    res.json({
      message: "🗑️ Producto eliminado correctamente",
      producto: productoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error al eliminar el producto",
      error: error.message,
    });
  }
};
