class Cliente {
    constructor({ id, cedula, nombre, apellido, ciudad, email, direccion, telefono, fecha_nacimiento }) {
        this.id = id;
        this.cedula = cedula; 
        this.nombre = nombre;
        this.apellido = apellido;
        this.ciudad = ciudad;
        this.email = email;
        this.direccion = direccion;
        this.telefono = telefono;
        this.fecha_nacimiento = fecha_nacimiento;
    }
}

export default Cliente