# 🐂 El Buey Madurado

Aplicación web para la gestión y presentación del restaurante **El Buey Madurado**, desarrollada como **Proyecto Integrado** de 2º DAW.  
El objetivo del proyecto es crear una solución moderna, escalable y visualmente atractiva para mostrar productos, gestionar contenido y conectar con clientes.

_________________________


## 🧱 Estructura del Proyecto

el-buey-madurado/
│
├── buey-madurado-frontend/ # Frontend en React + Vite + TailwindCSS
│ ├── src/
│ │ ├── components/ # Componentes reutilizables
│ │ ├── pages/ # Vistas y pantallas principales
│ │ ├── assets/ # Imágenes, íconos y recursos
│ │ └── App.jsx # Componente raíz
│ ├── index.html
│ ├── package.json
│ └── tailwind.config.js
│
├── buey-madurado-backend/ # Backend en Node.js + Express + MongoDB
│ ├── src/
│ │ ├── config/db.js # Conexión a la base de datos
│ │ ├── routes/ # Endpoints del servidor
│ │ ├── controllers/ # Lógica de negocio
│ │ └── models/ # Modelos de datos (MongoDB)
│ ├── .env.example # Plantilla para variables de entorno
│ ├── server.js # Servidor principal
│ └── package.json
│
├── .gitignore
└── README.md

_________________________


## 🚀 Tecnologías Utilizadas

### 🖥️ Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

### ⚙️ Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Mongoose](https://mongoosejs.com/)

_________________________


## 🧩 Configuración del Entorno

### 📁 1. Clonar el repositorio
```bash
git clone https://github.com/Michael-Llorens/el-buey-madurado.git
cd el-buey-madurado

⚙️ 2. Configurar el Backend

1- Entra en la carpeta del backend:

cd buey-madurado-backend

2- Instala las dependencias:

npm install

3- Crea un archivo .env en esta misma carpeta siguiendo la plantilla .env.example:

MONGO_URI=tu_url_de_conexion_a_mongodb
PORT=5000

4- Ejecuta el servidor:

npm run dev

El backend estará disponible en:
👉 http://localhost:5000

_________________________


🎨 3. Configurar el Frontend

1- Entra en la carpeta del frontend:

cd ../buey-madurado-frontend

2- Instala las dependencias:

npm install

3- Ejecuta el entorno de desarrollo:

npm run dev

El frontend estará disponible en:
👉 http://localhost:5173

_________________________


🌍 Despliegue en AWS (Pendiente)

El proyecto se desplegará en AWS utilizando servicios como:

EC2 / Lightsail para el backend.

S3 + CloudFront para el frontend.

MongoDB Atlas como base de datos en la nube.

_________________________


🔐 Variables de Entorno

Ejemplo del archivo .env.example:

# Puerto de ejecución del backend
PORT=5000

# URI de conexión a MongoDB Atlas
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/?appName=Cluster0

_________________________


🧠 Autor

Michael Alejandro Llorens García
📚 2º DAW — Proyecto Integrado 2025
💼 Desarrollador Full Stack (React, Node.js, MongoDB, TailwindCSS)

🔗 GitHub: https://github.com/Michael-Llorens

_________________________


🏗️ Estado del Proyecto

🟢 En desarrollo — Se están implementando las funcionalidades principales del backend y las vistas del frontend.
El despliegue en AWS y optimización final se realizará en fases posteriores.
