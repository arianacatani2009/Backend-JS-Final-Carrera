import { supabase } from "../database/database.js";  // Importamos supabase

// 1. Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {

    const { nombre, apellido, email, password } = req.body;

     // Verificar si el usuario ya está registrado en la base de datos
     const { data: existingUser, error: existingUserError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', email)
        .single(); // Usamos .single() para obtener un solo resultado

    if (existingUser) {
        return res.status(400).json({ message: 'Este correo ya está registrado en nuestra base de datos.' });
    }

    try {
        // Usamos Supabase Auth para registrar al usuario
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({ message: 'Error al registrar el usuario: ' + error.message });
        }

        // Ahora creamos el usuario en la tabla 'Usuarios', pero no necesitamos cifrar la contraseña
        const { data, insertError } = await supabase
            .from('usuarios')
            .insert([{
                nombre,
                apellido,
                email,
            }]);

        if (insertError) {
            return res.status(500).json({ message: 'Error al guardar el usuario en la base de datos: ' + insertError.message });
        }

        // Enviar un correo de activación (esto lo hace Supabase automáticamente)
        return res.status(201).json({ message: 'Usuario registrado exitosamente. Revisa tu correo para activar la cuenta.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un problema al registrar al usuario.' });
    }
};

// 2. Función para iniciar sesión
const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    console.log("Intentando iniciar sesión con:");
    console.log("Email:", email);
    console.log("Password:", password);

    try {
        // Usamos Supabase Auth para iniciar sesión
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return res.status(401).json({ message: 'Credenciales incorrectas o usuario no encontrado.' });
        }

        // Generamos el token de sesión (se genera automáticamente en Supabase Auth)
        const token = data.session.access_token;

        return res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        return res.status(500).json({ message: 'Hubo un problema al iniciar sesión.' });
    }
};


// 3. Función para recuperar la contraseña (enviar un enlace de recuperación)
const solicitarRecuperacion = async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos
        const { data: user, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Usamos Supabase Auth para enviar un correo de recuperación
        const { error: recoveryError } = await supabase.auth.api.resetPasswordForEmail(email);

        if (recoveryError) {
            return res.status(500).json({ message: 'Error al enviar el correo de recuperación: ' + recoveryError.message });
        }

        return res.json({ message: 'Correo de recuperación enviado exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un problema al solicitar la recuperación.' });
    }
};

// 4. Función para cambiar la contraseña después de hacer clic en el enlace de recuperación
const cambiarContrasena = async (req, res) => {
    const { token } = req.params;  // El token se pasa como parámetro en la URL
    const { newPassword } = req.body;  // La nueva contraseña se pasa en el cuerpo de la solicitud

    try {
        // Verificar si la nueva contraseña es válida
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        }

        // Usamos Supabase Auth para cambiar la contraseña con el token recibido
        const { user, error } = await supabase.auth.api.updateUser(token, { password: newPassword });

        if (error) {
            return res.status(400).json({ message: 'Error al cambiar la contraseña: ' + error.message });
        }

        return res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un problema al cambiar la contraseña.' });
    }
};

// 5. Función para obtener los datos del usuario
const obtenerDatosUsuario = async (req, res) => {
    const userId = req.userId; // Ahora tomamos el ID corregido

    console.log("\n🔹 Buscando usuario con ID:", userId, "\n");

    try {
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('id, nombre, apellido, email')
            .eq('id', userId)
            .single();

        if (error || !user) {
            console.error("❌ Error al encontrar el usuario en la base de datos:", error);
            return res.status(404).json({ message: 'Usuario no encontrado en la base de datos.' });
        }

        console.log("\n✅ Datos del usuario encontrados:", user, "\n");

        return res.json(user);
    } catch (error) {
        console.error("❌ Error en la obtención de datos del usuario:", error);
        return res.status(500).json({ message: 'Hubo un problema al obtener los datos del usuario.' });
    }
};


// 6. Función para editar los datos del usuario (solo correo y contraseña)
const editarUsuario = async (req, res) => {
    const { email } = req.body;  // Solo aceptamos el cambio de correo
    const userId = req.userId;  // Aseguramos que tomamos el ID correcto
    const token = req.headers['authorization'];  // Aseguramos que tenemos el token de sesión

    console.log("\n🔹 Editando correo del usuario con ID:", userId, "\n");

    // Verificar si el token de sesión está presente
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó el token de autenticación.' });
    }

    try {
        // Verificar si el usuario existe en la base de datos
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('id, email')
            .eq('id', userId)
            .single();

        if (error || !user) {
            console.error("❌ Usuario no encontrado en la base de datos:", error);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        console.log("\n✅ Usuario encontrado:", user, "\n");

        // Si no se proporcionó un correo
        if (!email) {
            return res.status(400).json({ message: "Debes proporcionar un correo para actualizar." });
        }

        // Verificamos la sesión del token usando Supabase Auth
        const { user: authUser, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            console.error("❌ Error de autenticación al verificar el token:", authError);
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }

        console.log("✅ Token verificado con éxito.");

        // Ahora, actualizamos el correo en Supabase Auth
        console.log("📩 Solicitando cambio de correo en Supabase Auth...");
        const { error: authUpdateError } = await supabase.auth.updateUser({ email });

        if (authUpdateError) {
            console.error("❌ Error al actualizar el correo en Supabase Auth:", authUpdateError);
            return res.status(500).json({ message: 'Error al actualizar el correo en Supabase Auth.' });
        }

        console.log("✅ Correo actualizado en Supabase Auth.");

        // Actualizamos el correo en la base de datos
        const { error: dbError } = await supabase
            .from('Usuarios')
            .update({ email })
            .eq('id', userId);

        if (dbError) {
            console.error("❌ Error al actualizar el correo en la base de datos:", dbError);
            return res.status(500).json({ message: 'Error al actualizar el correo en la base de datos.' });
        }

        console.log("✅ Correo actualizado en la base de datos.");

        return res.json({ message: 'Correo actualizado exitosamente.' });
    } catch (error) {
        console.error("❌ Error inesperado en la edición del usuario:", error);
        return res.status(500).json({ message: 'Hubo un problema al editar los datos del usuario.' });
    }
};


export { registrarUsuario, iniciarSesion, obtenerDatosUsuario, editarUsuario, solicitarRecuperacion, cambiarContrasena };