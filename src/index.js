import { connection } from './database/database.js'
import app from './server.js'

// Inicializamos la conexión a Supabase
connection()

// Inicialización del servidor
app.listen(app.get('port'), () => {
    console.log("--------------------------------------------")
    console.log(`Servidor inicializado en el puerto ${app.get('port')}`)
    console.log("--------------------------------------------")


// Indicación de procesos
    console.log("--------------------------------------------")
    console.log("Esperando cambios en el servidor...")
    console.log("--------------------------------------------")
})