import { createPool } from "mysql2/promise";
import { DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, DB_PORT } from "../config.js";

//Crear una conexion usando el driver 'mysql2'
export const pool = createPool({
    host: DB_HOST,  // Host de tu base de datos
    user: DB_USER,       // Usuario de MySQL
    password: DB_PASSWORD,  // Contraseña del usuario
    port: DB_PORT, //Puerto donde corre mysql
    database: DB_NAME // Base de datos
})
