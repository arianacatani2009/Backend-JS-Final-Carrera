import { Router } from 'express';

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
router.post('/cliente/registro', registrarCliente);
router.get('/cliente/ver', obtenerClientePorId);
router.get('/clientes', listarClientes);
router.put('/cliente/actualizar', modificarClientePorId);
router.delete('/cliente/eliminar', eliminarClientePorId);

export default router