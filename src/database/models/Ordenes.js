class Pedido {
    constructor({ id, codigo, descripcion, cedula_cliente, id_producto, fecha_creacion }) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.cedula_cliente = cedula_cliente;
        this.id_producto = id_producto;
        this.fecha_creacion = fecha_creacion;
    }
}

export default Pedido;