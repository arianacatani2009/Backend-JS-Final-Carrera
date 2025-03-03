import {
    agregarPedido,
    editarPedido,
    obtenerPedido,
    listarPedidos,
    eliminarPedido,
    obtenerPedidosporCliente
} from '../controllers/pedido.controller.js'
import verificarSesion from "../middleware/authVerifier.js";
import {Router} from 'express'

const router = Router();

// Rutas de los pedidos
router.post('/pedidos/nuevo', verificarSesion, agregarPedido);
router.get('/pedidos', verificarSesion, listarPedidos);
router.get('/pedidos/ver/:id', verificarSesion, obtenerPedido);
router.get('/pedidos/ver/cliente/:cedula_cliente', verificarSesion, obtenerPedidosporCliente);
router.put('/pedidos/editar/:id', verificarSesion, editarPedido);
router.delete('/pedidos/eliminar/:id', verificarSesion, eliminarPedido);

export default router;