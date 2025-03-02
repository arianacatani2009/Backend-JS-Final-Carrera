import { supabase } from "../database/database.js";

const verificarSesion = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó el token de autenticación.' });
    }

    const token = authHeader.split(' ')[1]; // Extrae solo el token

    console.log("\n🔹 Token de autorización recibido:\n", token, "\n");

    try {
        // Obtener el usuario desde Supabase Auth
        const { data: userData, error: authError } = await supabase.auth.getUser(token);

        if (authError || !userData?.user) {
            console.error("❌ Error en la autenticación:", authError);
            return res.status(401).json({ message: 'Token inválido o expirado.', error: authError });
        }

        const userEmail = userData.user.email; // Tomamos el email del usuario autenticado
        console.log("\n✅ Usuario autenticado con correo:", userEmail, "\n");

        // Ahora buscamos al usuario en la tabla `Usuarios` usando el email
        const { data: userRecord, error: userError } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', userEmail)
            .single();

        if (userError || !userRecord) {
            console.error("❌ Error al encontrar el usuario en la base de datos:", userError);
            return res.status(404).json({ message: 'Usuario no encontrado en la base de datos.' });
        }

        console.log("\n✅ ID correcto del usuario en la base de datos:", userRecord.id, "\n");

        // Guardamos el ID correcto del usuario en la request
        req.userId = userRecord.id;

        next();  // Continuamos con la siguiente función
    } catch (error) {
        console.error("❌ Error en la verificación de sesión:", error);
        return res.status(500).json({ message: 'Hubo un problema al verificar la sesión.' });
    }
};

export default verificarSesion;