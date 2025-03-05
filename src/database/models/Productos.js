class Producto {
    constructor({ id, nombre, apellido, cedula, fecha_nacimiento, genero, ciudad, direccion, telefono, email }) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.fecha_nacimiento = fecha_nacimiento;
        this.genero = genero;
        this.ciudad = ciudad;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }
}

export default Producto;
