const { db } = require("../connections/db");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class LoginController {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    try {
      // Buscar el usuario en la base de datos
      let user = await db("users").where({ email }).first();

      if (!user) {
        return {
          data: {
            success: false,
            message: "Usuario Incorrecto.",
            error: "Usuario no Encontrado.",
            status: 409, // 500 Internal Server Error
          },
        };
      }

      // bcrypt.compare(password, user.password, function (err, result) {
      //   if (err) {
      //     console.error(err);
      //   }
      //   console.log("Coincide:", result); // Debería ser `true` si el hash es correcto
      // });

      // Verificar la contraseña
      let passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return {
          data: {
            success: false,
            message: "Contraseña Incorrecta.",
            error: "Contraseña Incorrecta.",
            status: 409, // 500 Internal Server Error
          },
        };
      }

      // Generar un token de autenticación
      const token = jwt.sign({ id: user.id }, "your-secret-key", {
        expiresIn: "1h",
      });

      return {
        data: {
          success: true,
          message: "Logeado.",
          access_token: token,
          user_id: user.id,
          token_type: "Bearer",
          status: 200, // 200 OK
        },
      };
    } catch (error) {
      console.log(error);
      return {
        data: {
          success: false,
          message:
            "Lo sentimos, algo ha ido mal, inténtelo de nuevo más tarde.",
          error: error.message,
          status: 500, // 500 Internal Server Error
        },
      };
    }
  }
}

module.exports = new LoginController();
