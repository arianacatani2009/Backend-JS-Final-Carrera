import express from 'express';
import { registrarProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';
import verificarSesion from '../middleware/authVerifier.js'

const router = express.Router();

router.post('/productos/registrar', verificarSesion, registrarProducto);       // Registrar un producto
router.get('/productos', verificarSesion, obtenerProductos);        // Obtener lista de productos
router.get('/productos/:id', verificarSesion, obtenerProductoPorId); // Obtener producto por ID
router.put('/productos/:id', verificarSesion, actualizarProducto);  // Editar producto por ID
router.delete('/productos/:id', verificarSesion, eliminarProducto); // Eliminar producto por ID

export default router;
