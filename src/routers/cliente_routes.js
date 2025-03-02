import { Router } from 'express';
import verificarSesion from '../middleware/authVerifier.js'

// Definición de rutas con ExpressJS
const router = Router(); 

// Importamos las funciones del controlador
import {
    registrarCliente,
    listarClientes,
    obtenerClientePorId,
    eliminarClientePorId,
    modificarClientePorId
} from '../controllers/cliente.controller.js'; 


// Define las rutas directamente en el router
router.post('/cliente/registro', verificarSesion, registrarCliente);
router.get('/cliente/ver', verificarSesion, obtenerClientePorId);
router.get('/clientes', verificarSesion, listarClientes);
router.put('/cliente/actualizar', verificarSesion, modificarClientePorId);
router.delete('/cliente/eliminar', verificarSesion, eliminarClientePorId);

export default router