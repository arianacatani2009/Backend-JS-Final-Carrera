import express from 'express';
import cors from 'cors';
import clienteRoutes from './routers/cliente_routes.js';
import usuarioRoutes from './routers/usuarios_routes.js';
import productosRoutes from './routers/productos_routes.js';
import pedidosRoutes from './routers/pedidos_routes.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

// Inicializaciones
const app = express();
dotenv.config();

// Configuraciones
app.use(cors());
app.set('port', process.env.port || 3000);

// Middlewares
app.use(express.json());

// ------------- Definición de rutas
//Ruta base
app.get('/', (req, res) => res.status(200).send('Bienvenido al Backend del Examen de Final de Carrera'));
// Cliente
app.use('/api', clienteRoutes);
// Usuario
app.use('/api', usuarioRoutes);
// Productos
app.use('/api', productosRoutes);
// Pedidos
app.use('/api', pedidosRoutes);

// Cargar el archivo swagger.yaml
const swaggerDocument = yaml.load(fs.readFileSync(path.join(process.cwd(), './src/api_doc.yaml'), 'utf8'));

// Usar Swagger UI Express para servir la documentación
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas no existentes
app.use((req, res) => res.status(404).send("Ruta no encontrada - 404"));

export default app;