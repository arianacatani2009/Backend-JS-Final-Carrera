import {Router} from 'express'
import * as user from '../controllers/user.controller.js'
import verificarSesion from '../middleware/authVerifier.js'

const router = Router()

// Definimos las rutas del usuarip
router.post('/usuario/registro', user.registrarUsuario)
router.post('/usuario/login', user.iniciarSesion)
router.post('/usuario/recuperar-password', user.solicitarRecuperacion)
router.get('/usuario/informacion', verificarSesion, user.obtenerDatosUsuario)
router.put('/usuario/editar-info', verificarSesion, user.editarUsuario)
// Modificamos la ruta para que el token se pase como parámetro en la URL
router.put('/usuario/cambiar-password/:token', user.cambiarContraseña);

export default router;