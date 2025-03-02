import { supabase } from '../database/database.js';  // Importamos la conexión a Superbase
import Cliente from '../database/models/Cliente.js'; // Accedemos al modelo Cliente

// Función para registrar un nuevo cliente
const registrarCliente = async (clienteData) => {
    try {
        // Validar y crear el objeto Cliente
        const cliente = new Cliente(clienteData);

        // Insertar cliente en la base de datos
        const { data, error } = await supabase.from('cliente').insert([
            {
                cedula: cliente.cedula,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                ciudad: cliente.ciudad,
                email: cliente.email,
                direccion: cliente.direccion,
                telefono: cliente.telefono,
                fecha_nacimiento: cliente.fecha_nacimiento
            }
        ]);

        if (error) throw error;

        console.log('Cliente registrado con éxito:', data);
        return data;
    } catch (e) {
        console.error('Error al registrar cliente:', e.message);
        throw e;
    }
};

// Función para listar todos los clientes
const listarClientes = async () => {
    try {
        const { data, error } = await supabase.from('cliente').select('*');
        if (error) throw error;

        console.log('Clientes:', data);
        return data;
    } catch (e) {
        console.error('Error al listar clientes:', e.message);
        throw e;
    }
};

// Función para obtener los datos de un cliente por ID
const obtenerClientePorId = async (id) => {
    try {
        const { data, error } = await supabase.from('cliente').select('*').eq('id', id).single();
        if (error) throw error;

        console.log('Cliente encontrado:', data);
        return data;
    } catch (e) {
        console.error(`Error al obtener el cliente con ID ${id}:`, e.message);
        throw e;
    }
};

// Función para eliminar un cliente por ID
const eliminarClientePorId = async (id) => {
    try {
        const { data, error } = await supabase.from('cliente').delete().eq('id', id);
        if (error) throw error;

        console.log(`Cliente con ID ${id} eliminado con éxito.`);
        return data;
    } catch (e) {
        console.error(`Error al eliminar el cliente con ID ${id}:`, e.message);
        throw e;
    }
};

// Función para modificar un cliente por ID con restricciones
const modificarClientePorId = async (id, clienteData) => {
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
        const { data, error } = await supabase.from('cliente').update(clienteData).eq('id', id);

        if (error) throw error;

        console.log(`Cliente con ID ${id} modificado con éxito:`, data);
        return data;
    } catch (e) {
        console.error(`Error al modificar el cliente con ID ${id}:`, e.message);
        throw e;
    }
};


export { registrarCliente, listarClientes, obtenerClientePorId, eliminarClientePorId, modificarClientePorId };