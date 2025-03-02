class Cliente {
    constructor({ id, cedula, nombre, apellido, ciudad, email, direccion, telefono, fecha_nacimiento }) {
        this.id = id;
        this.setCedula(cedula);
        this.nombre = nombre;
        this.apellido = apellido;
        this.ciudad = ciudad;
        this.email = email;
        this.direccion = direccion;
        this.setTelefono(telefono);
        this.fecha_nacimiento = fecha_nacimiento;
    }

    // Validación de cédula
    setCedula(cedula) {
        if (typeof cedula !== 'string' || cedula.length < 10 || cedula.length > 13) {
            throw new Error('La cédula debe tener entre 10 y 13 caracteres.');
        }
        this.cedula = cedula;
    }

    // Validación de teléfono
    setTelefono(telefono) {
        if (!/^[0-9]+$/.test(telefono)) {
            throw new Error('El teléfono solo debe contener números.');
        }
        this.telefono = telefono;
    }
}

export default Cliente;