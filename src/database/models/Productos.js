class Producto {
    constructor({ id, nombre, codigo, descripcion, categoria, precio, stock, fecha_ingreso, proveedor }) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.setPrecio(precio);
        this.setStock(stock);
        this.setFechaIngreso(fecha_ingreso);
        this.proveedor = proveedor;
    }

    // Validacion de precio
    setPrecio(precio){
        if(precio > 0){
            this.precio = precio
        }
        else{
            console.log("El precio no puede ser menor o igual a 0.")
        }
    }

    // Validación de stock
    setStock(stock) {
        if (stock < 0) {
            throw new Error('El stock no puede ser negativo.');
        }
        this.stock = stock;
        if (stock === 0) {
            console.warn('¡Alerta! El stock ha llegado a 0.');
        }
    }

    // Validación de fecha de ingreso
    setFechaIngreso(fecha_ingreso) {
        const fechaActual = new Date();
        const fechaIngresada = new Date(fecha_ingreso);
        if (fechaIngresada > fechaActual) {
            throw new Error('La fecha de ingreso no puede ser mayor a la fecha actual.');
        }
        this.fecha_ingreso = fechaIngresada;
    }
}

export default Producto;
