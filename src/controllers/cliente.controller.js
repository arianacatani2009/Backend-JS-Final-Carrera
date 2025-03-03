import { supabase } from '../database/database.js';  // Importamos la conexión a Superbase
import Cliente from '../database/models/Cliente.js'; // Accedemos al modelo Cliente
import { v4 as uuidv4, validate as isUUID } from 'uuid';// Importamos la librería para generar UUID

const registrarCliente = async (req, res) => {
    const {cedula, nombre, apellido, ciudad, email, direccion, telefono, fecha_nacimiento } = req.body;

    try {
        // Verifica que todos los campos estén presentes
        if (!cedula || !nombre || !apellido || !ciudad || !direccion || !email || !fecha_nacimiento) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }   

        // Verifica que la cédula tenga entre 10 y 13 caracteres
        if (cedula.length < 10 || cedula.length > 13) {
            return res.status(400).json({ message: "La cédula debe contener entre 10 y 13 caracteres." });
        }

        // Verifica que el teléfono tenga máximo 10 dígitos
        if (telefono.length > 10) {
            return res.status(400).json({ message: "El teléfono debe tener máximo 10 dígitos." });
        }

         // Generar un UUID para el cliente
         const id = uuidv4();

        // Crear el objeto Cliente
        const clienteData = {
            id,
            cedula,
            nombre,
            apellido,
            ciudad,
            email,
            direccion,
            telefono,
            fecha_nacimiento
        };

        console.log("Objeto cliente creado:", clienteData);

        const cliente = new Cliente(clienteData); // Aquí se valida la cédula

        // Insertar cliente en la base de datos
        const { data, error } = await supabase.from('cliente').insert([{
            id: cliente.id,
            cedula: cliente.cedula,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            ciudad: cliente.ciudad,
            email: cliente.email,
            direccion: cliente.direccion,
            telefono: cliente.telefono,
            fecha_nacimiento: cliente.fecha_nacimiento
        }]);

        // Si ocurre un error al insertar
        if (error) {
            console.error("Error al insertar en la base de datos:", error);
            return res.status(500).json({ message: "Error al registrar el cliente en la base de datos.", error });
        }

        // Cliente registrado correctamente
        return res.status(201).json({ message: 'Cliente registrado con éxito.', data });
    } catch (e) {
        console.error('Error al registrar cliente:', e.message);
        return res.status(500).json({ message: 'Hubo un problema al registrar el cliente.' });
    }
};

// Función para listar los clientes
const listarClientes = async () => {
    try {
        const { data, error } = await supabase
            .from('cliente')
            .select('*')

        if (error) {
            if (error.code === 'PGRST116') {
                return { message: 'No existen clientes.' };
            }
            return { error: 'Error al consultar los clientes.' };
        }

        return { message: 'Clientes obtenidos con éxito', data: data };
    } catch (e) {
        console.error('Error al listar clientes:', e.message);
        return { error: 'Error interno en el servidor.' };
    }
};

// Función para obtener los datos de un cliente por ID
const obtenerClientePorId = async (cedula) => {
    try {
        console.log('Cédula recibida:', cedula);

        // Validar si la cédula es un string no vacío
        if (!cedula || typeof cedula !== 'string' || cedula.trim() === '') {
            throw new Error('Cédula inválida. Debe ser un string no vacío.');
        }

        const { data, error } = await supabase
            .from('cliente')
            .select('*')
            .eq('cedula', cedula)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Código de error si no hay coincidencias
                return { message: 'No existe cliente con esa cédula' };
            }
            throw error;
        }

        console.log('Cliente encontrado:', data);
        return data;
    } catch (e) {
        console.error(`Error al obtener el cliente con cédula ${cedula}:`, e.message);
        throw e;
    }
};


// Función para eliminar un cliente por ID
const eliminarClientePorId = async (cedula) => {
    try {
        const { data, error } = await supabase.from('cliente').delete().eq('cedula', cedula);
        if (error) throw error;

        console.log(`Cliente con ID ${cedula} eliminado con éxito.`);
        return data;
    } catch (e) {
        console.error(`Error al eliminar el cliente con ID ${id}:`, e.message);
        throw e;
    }
};

// Función para modificar un cliente por ID con restricciones
const modificarClientePorId = async (cedula, clienteData) => {
    try {
        // Los unicos campos admitidos para la modificación son dirección, correo, teléfono y ciudad
        const camposPermitidos = ['direccion', 'ciudad', 'telefono', 'email'];
        const keys = Object.keys(clienteData);
        
        // Verificar que solo se incluyen los campos permitidos
        const camposInvalidos = keys.filter(key => !camposPermitidos.includes(key));
        if (camposInvalidos.length > 0) {
            throw new Error(`Los campos ${camposInvalidos.join(', ')} no son modificables.`);
        }

        // Realizar la actualización
        const { data, error } = await supabase.from('cliente').update(clienteData).eq('cedula', cedula)

        if (error) throw error;

        console.log(`Cliente con ID ${cedula} modificado con éxito:`, data);
        return data;
    } catch (e) {
        console.error(`Error al modificar el cliente con ID ${cedula}:`, e.message);
        throw e;
    }
};


export { registrarCliente, listarClientes, obtenerClientePorId, eliminarClientePorId, modificarClientePorId };