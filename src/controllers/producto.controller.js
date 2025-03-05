import Producto from "../database/models/Productos.js";
import { supabase } from "../database/database.js";

// Registrar un producto
export const registrarProducto = async (req, res) => {
    const { nombre, apellido, cedula, fecha_nacimiento, genero, ciudad, direccion, telefono, email } = req.body;

    try {
        // Validaciones de datos
        if (!nombre || !apellido || !cedula || !fecha_nacimiento || !genero || !ciudad || !direccion || !telefono || !email) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        if (typeof cedula !== 'string' || cedula.length < 10 || cedula.length > 13) {
            return res.status(400).json({ message: "La cédula debe contener entre 10 y 13 caracteres." });
        }

        if (typeof telefono !== 'string' || telefono.length > 10) {
            return res.status(400).json({ message: "El teléfono debe tener máximo 10 dígitos." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "El email no es válido." });
        }

        // Obtener el último id registrado
        const { data: lastProduct, error: lastProductError } = await supabase
            .from('tecnico')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);

        if (lastProductError) {
            console.error("Error obteniendo el último ID:", lastProductError);
            return res.status(500).json({ message: "Error obteniendo el último ID.", error: lastProductError.message });
        }

        // Generar nuevo ID
        let newId;

        // Si no hay registros, empieza desde 1
        if (!lastProduct || lastProduct.length === 0 || !lastProduct[0].id) {
            newId = 1;
        } else {
            // Incrementa el último ID registrado
            newId = Number(lastProduct[0].id) + 1;
        }

        // Crear objeto técnico
        const tecnico = {
            id: newId,
            cedula,
            nombre,
            apellido,
            fecha_nacimiento,
            genero,
            ciudad,
            direccion,
            telefono,
            email
        };

        console.log("Registrando técnico con datos:", tecnico);

        // Insertar técnico en Supabase
        const { data, error } = await supabase.from('tecnico').insert([tecnico]);

        if (error) {
            console.error("Error al insertar en la base de datos:", error);
            return res.status(400).json({ message: "No se pudo registrar al técnico.", error: error.message });
        }

        return res.status(201).json({ message: "Técnico registrado con éxito.", data });
    } catch (e) {
        console.error("Error inesperado al registrar técnico:", e);
        return res.status(500).json({ message: "Error inesperado al registrar el técnico.", error: e.message });
    }
};


// Listar todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const { data, error } = await supabase.from('tecnico').select('*');

        if(data.length === 0) {
            return res.status(400).json({message: "No existe el tecnico en el sistema."})
        }

        if (error) {
            return res.status(400).json({ message: "Error en la base de datos" });
        }

        return res.status(200).json({ message: "Lista de tecnicos obtenida con éxito.", data });
    } catch (e) {
        console.error("Error al obtener el tecnico:", e.message);
        return res.status(500).json({ message: "Error al obtener la lista de tecnico.", error: e.message });
    }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase.from('tecnico').select('*').eq('id', id).single();

        if (error) {
            return res.status(404).json({ message: "Error en la base de datos" });
        }

        if (!data) {
            return res.status(404).json({ message: "tecnico no encontrado." });
        }

        return res.status(200).json({ message: "tecnico obtenido con éxito.", data });
    } catch (e) {
        console.error("Error al obtener tecnico por ID:", e.message);
        return res.status(500).json({ message: "Error al obtener el tecnico.", error: e.message });
    }
};

// Editar un producto por ID
export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, cedula, fecha_nacimiento , genero ,ciudad ,direccion ,telefono ,email } = req.body;

    try {
        console.log(`Datos recibidos para actualizar tecnico ID ${id}:`, req.body);

        // Obtener el producto actual antes de actualizar
        const { data: productoActual, error: errorBuscar } = await supabase.from('tecnico').select('*').eq('id', id).single();
        if (errorBuscar) return res.status(400).json({ message: "Error en la base de datos" });
        if (!productoActual) return res.status(404).json({ message: "tecnico no encontrado." });

        // Crear un nuevo objeto Producto con la información actualizada
        const productoActualizado = new Producto({
            id,
            nombre: nombre || productoActual.nombre,
            apellido: apellido || productoActual.apellido,
            cedula: cedula || productoActual.cedula,
            fecha_nacimiento: fecha_nacimiento || productoActual.fecha_nacimiento,
            genero: genero || productoActual.genero,
            ciudad: ciudad || productoActual.ciudad,
            direccion: direccion || productoActual.direccion,
            telefono: telefono || productoActual.telefono,
            email: email || productoActual.email
        });

        // Actualizar en la base de datos
        const { data, error } = await supabase.from('tecnico').update({
            nombre: productoActualizado.nombre,
            apellido: productoActualizado.apellido,
            cedula: productoActualizado.cedula,
            fecha_nacimiento: productoActualizado.fecha_nacimiento,
            genero: productoActualizado.genero,
            ciudad: productoActualizado.ciudad,
            direccion: productoActualizado.direccion,
            telefono: productoActualizado.telefono,
            email: productoActualizado.email,
        }).eq('id', id);

        if (error) return res.status(404).json({ message: "Error en la base de datos" });

        return res.status(200).json({ message: "Tecnico actualizado con éxito.", data });
    } catch (e) {
        console.error("Error al actualizar Tecnico:", e.message);
        return res.status(500).json({ message: "Error al actualizar el Tecnico.", error: e.message });
    }
};

// Eliminar un producto por ID
export const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el producto existe antes de eliminarlo
        const { data: productoExistente, error: errorBuscar } = await supabase.from('tecnico').select('*').eq('id', id).single();
        if (errorBuscar) return res.status(400).json({ message: "Error en la base de datos" });
        if (!productoExistente) return res.status(404).json({ message: "Tecnico no encontrado." });

        // Eliminar producto
        const { data, error } = await supabase.from('tecnico').delete().eq('id', id);

        if (error) return res.status(404).json({ message: "Error en la base de datos" });

        return res.status(200).json({ message: "tecnico eliminado con éxito." });
    } catch (e) {
        console.error("Error al eliminar tecnico:", e.message);
        return res.status(500).json({ message: "Error al eliminar el tecnico.", error: e.message });
    }
};
