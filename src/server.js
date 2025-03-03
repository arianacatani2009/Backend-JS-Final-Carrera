import express from 'express'
import cors from 'cors'
import clienteRoutes from './routers/cliente_routes.js'
import usuarioRoutes from './routers/usuarios_routes.js'
import productosRoutes from './routers/productos_routes.js'
import dotenv from 'dotenv'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones
app.use(cors())
app.set('port', process.env.port || 3000)

//Middlwares
app.use(express.json());

// Definición de rutas
// Cliente
app.use('/api', clienteRoutes)
// Usuario
app.use('/api', usuarioRoutes)
//Prouctos
app.use('/api', productosRoutes)

// Rutas no existentes
app.use((req,res)=> res.status(404).send("Ruta no encontrada - 404"))

export default app