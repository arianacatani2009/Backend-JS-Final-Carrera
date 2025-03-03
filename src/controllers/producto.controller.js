import Producto from "../database/models/Productos.js";
import { supabase } from "../database/database.js";

// Registrar un producto
export const registrarProducto = async (req, res) => {
    const { nombre, codigo, descripcion, categoria, precio, stock, fecha_ingreso, proveedor } = req.body;

    try {
        // Validar que todos los campos obligatorios estén presentes
        if (!nombre || !codigo || !descripcion || !categoria || precio === undefined || stock === undefined || !fecha_ingreso || !proveedor) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        console.log("Datos recibidos para registrar producto:", req.body);

        // Crear el objeto Producto con validaciones
        const producto = new Producto({ nombre, codigo, descripcion, categoria, precio, stock, fecha_ingreso, proveedor });

        // Insertar en Supabase
        const { data, error } = await supabase.from('productos').insert([{
            nombre: producto.nombre,
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            precio: producto.precio,
            stock: producto.stock,
            fecha_ingreso: producto.fecha_ingreso.toISOString(), // Convertir la fecha a formato ISO
            proveedor: producto.proveedor
        }]);

        if (error) {
            throw error;
        }

        return res.status(201).json({ message: "Producto registrado con éxito.", data });
    } catch (e) {
        console.error("Error al registrar producto:", e.message);
        return res.status(500).json({ message: "Error al registrar el producto.", error: e.message });
    }
};

// Listar todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const { data, error } = await supabase.from('productos').select('*');

        if (error) {
            throw error;
        }

        return res.status(200).json({ message: "Lista de productos obtenida con éxito.", data });
    } catch (e) {
        console.error("Error al obtener productos:", e.message);
        return res.status(500).json({ message: "Error al obtener la lista de productos.", error: e.message });
    }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        return res.status(200).json({ message: "Producto obtenido con éxito.", data });
    } catch (e) {
        console.error("Error al obtener producto por ID:", e.message);
        return res.status(500).json({ message: "Error al obtener el producto.", error: e.message });
    }
};

// Editar un producto por ID
export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo, descripcion, categoria, precio, stock, fecha_ingreso, proveedor } = req.body;

    try {
        console.log(`Datos recibidos para actualizar producto ID ${id}:`, req.body);

        // Obtener el producto actual antes de actualizar
        const { data: productoActual, error: errorBuscar } = await supabase.from('productos').select('*').eq('id', id).single();
        if (errorBuscar) throw errorBuscar;
        if (!productoActual) return res.status(404).json({ message: "Producto no encontrado." });

        // Crear un nuevo objeto Producto con la información actualizada
        const productoActualizado = new Producto({
            id,
            nombre: nombre || productoActual.nombre,
            codigo: codigo || productoActual.codigo,
            descripcion: descripcion || productoActual.descripcion,
            categoria: categoria || productoActual.categoria,
            precio: precio !== undefined ? precio : productoActual.precio,
            stock: stock !== undefined ? stock : productoActual.stock,
            fecha_ingreso: fecha_ingreso || productoActual.fecha_ingreso,
            proveedor: proveedor || productoActual.proveedor
        });

        // Actualizar en la base de datos
        const { data, error } = await supabase.from('productos').update({
            nombre: productoActualizado.nombre,
            codigo: productoActualizado.codigo,
            descripcion: productoActualizado.descripcion,
            categoria: productoActualizado.categoria,
            precio: productoActualizado.precio,
            stock: productoActualizado.stock,
            fecha_ingreso: productoActualizado.fecha_ingreso.toISOString(),
            proveedor: productoActualizado.proveedor
        }).eq('id', id);

        if (error) throw error;

        return res.status(200).json({ message: "Producto actualizado con éxito.", data });
    } catch (e) {
        console.error("Error al actualizar producto:", e.message);
        return res.status(500).json({ message: "Error al actualizar el producto.", error: e.message });
    }
};

// Eliminar un producto por ID
export const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el producto existe antes de eliminarlo
        const { data: productoExistente, error: errorBuscar } = await supabase.from('productos').select('*').eq('id', id).single();
        if (errorBuscar) throw errorBuscar;
        if (!productoExistente) return res.status(404).json({ message: "Producto no encontrado." });

        // Eliminar producto
        const { data, error } = await supabase.from('productos').delete().eq('id', id);

        if (error) throw error;

        return res.status(200).json({ message: "Producto eliminado con éxito." });
    } catch (e) {
        console.error("Error al eliminar producto:", e.message);
        return res.status(500).json({ message: "Error al eliminar el producto.", error: e.message });
    }
};
