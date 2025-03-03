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

        // Obtener el último id registrado
        const { data: lastProduct, error: lastProductError } = await supabase
            .from('producto')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);

        if (lastProductError) {
            return res.status(400).json({ message: lastProductError.message });
        }

        let newId;

        // Si no hay productos en la base de datos, empezar desde EJPD00001
        if (lastProduct.length === 0) {
            newId = 'EJPD00001';
        } else {
            // Extraer el número del último ID y generar el siguiente
            const lastIdNumber = parseInt(lastProduct[0].id.slice(4), 10); // Eliminar el prefijo EJPD y convertir el número
            const newIdNumber = lastIdNumber + 1; // Incrementar el número
            newId = `EJPD${newIdNumber.toString().padStart(5, '0')}`; // Formatear el nuevo ID con ceros
        }

        // Crear el objeto Producto con validaciones
        const producto = {
            id: newId, // Asignamos el ID único generado
            nombre,
            codigo,
            descripcion,
            categoria,
            precio,
            stock,
            fecha_ingreso,
            proveedor
        };

        console.log("Datos recibidos para registrar producto:", req.body);

        // Insertar el producto en Supabase
        const { data, error } = await supabase.from('producto').insert([{
            id: producto.id, // Insertamos el ID único generado
            nombre: producto.nombre,
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            precio: producto.precio,
            stock: producto.stock,
            fecha_ingreso: producto.fecha_ingreso,
            proveedor: producto.proveedor
        }]);

        if (error) {
            return  res.status(400).json({ message: "No se pudo registrar el producto" + error});
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
        const { data, error } = await supabase.from('producto').select('*');

        if(data.length === 0) {
            return res.status(400).json({message: "No existen productos en el sistema."})
        }

        if (error) {
            return res.status(400).json({ message: "Error en la base de datos" });
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
        const { data, error } = await supabase.from('producto').select('*').eq('id', id).single();

        if (error) {
            return res.status(404).json({ message: "Error en la base de datos" });
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
    const { nombre, codigo, descripcion, categoria, precio, proveedor } = req.body;

    try {
        console.log(`Datos recibidos para actualizar producto ID ${id}:`, req.body);

        // Obtener el producto actual antes de actualizar
        const { data: productoActual, error: errorBuscar } = await supabase.from('producto').select('*').eq('id', id).single();
        if (errorBuscar) return res.status(400).json({ message: "Error en la base de datos" });
        if (!productoActual) return res.status(404).json({ message: "Producto no encontrado." });

        // Crear un nuevo objeto Producto con la información actualizada
        const productoActualizado = new Producto({
            id,
            nombre: nombre || productoActual.nombre,
            codigo: codigo || productoActual.codigo,
            descripcion: descripcion || productoActual.descripcion,
            categoria: categoria || productoActual.categoria,
            precio: precio !== undefined ? precio : productoActual.precio,
            proveedor: proveedor || productoActual.proveedor
        });

        // Actualizar en la base de datos
        const { data, error } = await supabase.from('producto').update({
            nombre: productoActualizado.nombre,
            codigo: productoActualizado.codigo,
            descripcion: productoActualizado.descripcion,
            categoria: productoActualizado.categoria,
            precio: productoActualizado.precio,
            proveedor: productoActualizado.proveedor
        }).eq('id', id);

        if (error) return res.status(404).json({ message: "Error en la base de datos" });

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
        const { data: productoExistente, error: errorBuscar } = await supabase.from('producto').select('*').eq('id', id).single();
        if (errorBuscar) return res.status(400).json({ message: "Error en la base de datos" });
        if (!productoExistente) return res.status(404).json({ message: "Producto no encontrado." });

        // Eliminar producto
        const { data, error } = await supabase.from('producto').delete().eq('id', id);

        if (error) return res.status(404).json({ message: "Error en la base de datos" });

        return res.status(200).json({ message: "Producto eliminado con éxito." });
    } catch (e) {
        console.error("Error al eliminar producto:", e.message);
        return res.status(500).json({ message: "Error al eliminar el producto.", error: e.message });
    }
};
