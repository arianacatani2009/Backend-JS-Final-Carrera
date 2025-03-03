import Pedido from '../database/models/Ordenes.js'
import {supabase} from "../database/database.js";

// Función para generar un nuevo ID secuencial de 6 dígitos
const generarNuevoId = async () => {
    const { data, error } = await supabase
        .from('pedidos')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

    if (error) throw error;
    const nuevoId = data.length > 0 ? String(parseInt(data[0].id) + 1).padStart(6, '0') : '000001';
    return nuevoId;
};

// Función para generar un nuevo código de pedido
const generarCodigoPedido = async () => {
    const nuevoId = await generarNuevoId();
    return `PDO-${nuevoId}`;
};

// Agregar pedido
export const agregarPedido = async (req, res) => {
    try {
        const nuevoId = await generarNuevoId();
        const nuevoCodigo = await generarCodigoPedido();
        const { descripcion, cedula_cliente, id_producto } = req.body;
        const fecha_creacion = new Date().toISOString().split('T')[0];

        // Verificar si el cliente existe
        const { data: cliente, error: errorCliente } = await supabase
            .from('cliente')
            .select('cedula')
            .eq('cedula', cedula_cliente)
            .single();

        if (errorCliente || !cliente) {
            return res.status(400).json({ error: 'Cliente no encontrado' });
        }

        // Si id_producto es un solo producto, convertirlo en un array
        const productos = Array.isArray(id_producto) ? id_producto : [id_producto];

        // Obtener los productos con los códigos proporcionados
        const { data: productosData, error: errorProductos } = await supabase
            .from('producto')
            .select('codigo')
            .in('codigo', productos); // Usar la columna "codigo" para la consulta

        if (errorProductos) {
            console.error("Error al obtener productos:", errorProductos);
            return res.status(500).json({ error: 'Error al obtener los productos', detalles: errorProductos });
        }

        // Verificar si todos los productos existen
        if (productosData.length !== productos.length) {
            return res.status(400).json({ error: 'Algunos productos no existen en la base de datos' });
        }

        // Extraer los códigos de los productos obtenidos
        const codigosProductos = productosData.map(producto => producto.codigo);

        // Crear el pedido con los códigos de los productos
        const pedido = new Pedido({
            id: nuevoId,
            codigo: nuevoCodigo,
            descripcion,
            cedula_cliente,
            id_producto: codigosProductos, // Guardar solo los códigos de los productos
            fecha_creacion
        });

        const { error } = await supabase.from('pedidos').insert([pedido]);
        if (error) return res.status(404).json({ error });

        res.status(201).json({ mensaje: 'Pedido agregado', pedido });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ver lista de pedidos
export const listarPedidos = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('id, codigo, descripcion, cedula_cliente, id_producto, fecha_creacion');

        if (error) return res.status(404).json({error});

        const pedidosConCantidadProductos = data.map(pedido => ({
            ...pedido,
            cantidad_productos: pedido.id_producto.length
        }));

        res.status(200).json(pedidosConCantidadProductos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener pedido por ID y su información
export const obtenerPedido = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el pedido con la lista de códigos de productos
        const { data: pedido, error: errorPedido } = await supabase
            .from('pedidos')
            .select('*') // Seleccionamos todos los campos del pedido
            .eq('id', id)
            .single();

        if (errorPedido) return res.status(404).json({ error: 'Pedido no encontrado' });

        const codigosProductos = pedido.id_producto;

        if (!codigosProductos || codigosProductos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos en el pedido' });
        }

        // Obtener los detalles completos de los productos utilizando los códigos
        const { data: productos, error: errorProductos } = await supabase
            .from('producto')
            .select('*')
            .in('codigo', codigosProductos);

        if (errorProductos) return res.status(500).json({ error: 'Error al obtener los productos', detalles: errorProductos });

        // Crear una nueva estructura para el pedido, sin redundar en la lista de códigos
        const pedidoConProductos = {
            ...pedido,
            productos: productos
        };

        // No mostramos la información de los id_productos
        delete pedidoConProductos.id_producto;

        // Enviar la respuesta con el pedido y los productos completos
        res.status(200).json(pedidoConProductos);

    } catch (error) {
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
};

// Mostrar pedidos por cliente
export const obtenerPedidosporCliente = async (req, res) => {
    try {
        const { cedula_cliente } = req.params;

        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .eq('cedula_cliente', cedula_cliente);

        if (error) {
            return res.status(500).json({ error: 'Error al obtener los pedidos', detalles: error });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este cliente' });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
};


// Editar pedido
export const editarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, id_cliente, id_producto } = req.body;

        const { error } = await supabase
            .from('pedidos')
            .update({ descripcion, id_cliente, id_producto })
            .eq('id', id);

        if (error) return res.status(404).json({error});
        res.status(200).json({ mensaje: 'Pedido actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('pedidos')
            .delete()
            .eq('id', id);

        if (error) return res.status(404).json({error});
        res.status(200).json({ mensaje: 'Pedido eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
