import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, enum: ["hamburguesa", "entrante", "postre"], required: true },
    imagen: { type: String }, // opcional, por si más adelante agregas URLs de imágenes
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;