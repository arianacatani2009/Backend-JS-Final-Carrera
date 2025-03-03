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

router.get('/cliente/ver/:cedula', verificarSesion, async (req, res) => {
    try {
        console.log('Todos los parámetros:', req.params);
        const { cedula } = req.params;
        console.log('Cédula recibida:', cedula, 'Tipo:', typeof cedula);

        if (!cedula || typeof cedula !== 'string' || cedula.trim() === '') {
            return res.status(400).json({ error: 'Cédula inválida' });
        }

        const cliente = await obtenerClientePorId(cedula);

        if (cliente.message) {
            return res.status(200).json(cliente);
        }

        res.json(cliente);
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/clientes', verificarSesion, async (req, res) => {
    try {
        const result = await listarClientes(); 

        if (result.error) {
            return res.status(500).json(result);
        }

        return res.status(200).json(result);
    } catch (e) {
        console.error('Error al obtener clientes:', e.message);
        return res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

router.put('/cliente/actualizar/:cedula', verificarSesion, async (req, res) => {
    try {
        const { cedula } = req.params;
        const { email, telefono, direccion, ciudad } = req.body;

        console.log('Cédula recibida:', cedula);

        if (!cedula || typeof cedula !== 'string' || cedula.trim() === '') {
            return res.status(400).json({ error: 'Cédula inválida. Debe ser un string no vacío.' });
        }

        const clienteActual = await obtenerClientePorId(cedula);

        // Verificar si el cliente existe
        if (!clienteActual) {
            return res.status(404).json({ error: 'Cliente no encontrado con esa cédula' });
        }

        const datosAActualizar = {};

        if (email) datosAActualizar.email = email;
        if (telefono) datosAActualizar.telefono = telefono;
        if (direccion) datosAActualizar.direccion = direccion;
        if (ciudad) datosAActualizar.ciudad = ciudad;

        if (Object.keys(datosAActualizar).length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado datos válidos para actualizar.' });
        }

        const clienteModificado = await modificarClientePorId(cedula, datosAActualizar);

        res.status(200).json({message: `Cliente modificado con éxito: ${clienteModificado}`});
    } catch (e) {
        console.error(`Error al actualizar el cliente con cédula ${cedula}:`, e.message);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

// Ruta para eliminar el cliente
router.delete('/cliente/eliminar/:cedula', verificarSesion, async (req, res) => {
    try {
        const { cedula } = req.params;
        console.log('Cédula recibida para eliminar:', cedula);

        if (!cedula || typeof cedula !== 'string' || cedula.trim() === '') {
            return res.status(400).json({ error: 'Cédula inválida. Debe ser un string no vacío.' });
        }

        await eliminarClientePorId(cedula);

        return res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (e) {
        console.error(`Error al eliminar el cliente con cédula ${cedula}:`, e.message);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});


export default router