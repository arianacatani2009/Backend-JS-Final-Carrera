import express from 'express';
import { registrarProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';
import verificarSesion from '../middleware/authVerifier.js'

const router = express.Router();

router.post('/productos/registrar', verificarSesion, registrarProducto);       // Registrar un producto
router.get('/productos', verificarSesion, obtenerProductos);        // Obtener lista de productos
router.get('/productos/ver/:id', verificarSesion, obtenerProductoPorId); // Obtener producto por ID
router.put('/productos/editar/:id', verificarSesion, actualizarProducto);  // Editar producto por ID
router.delete('/productos/eliminar/:id', verificarSesion, eliminarProducto); // Eliminar producto por ID

export default router;
