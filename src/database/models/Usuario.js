class Usuario {
    constructor({ id, nombre, apellido, email, password, token }) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;  // Ahora se guarda tal cual la contraseña
        this.token = token;
    }
}

export default Usuario;