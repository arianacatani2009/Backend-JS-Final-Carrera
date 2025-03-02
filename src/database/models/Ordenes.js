class Pedido {
    constructor({ id, codigo, descripcion, id_cliente, id_producto }) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.id_cliente = id_cliente;
        this.id_producto = id_producto;
    }
}

export default Pedido;