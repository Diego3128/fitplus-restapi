import express from "express"
import morgan from "morgan";

import { PORT } from '../config.js';

//rutas definidas
import foodRoutes from './routes/foods.routes.js';
import indexRoutes from './routes/index.routes.js';

//configuracion de express
const app = express();
app.set("PORT", PORT);
app.set("name", "Fit+ RESTapi");
app.set("availableRoutes", [
    { method: "GET", route: "/api/foods" },
    { method: "GET", route: "/api/foods/:id" },
    { method: "POST", route: "/api/foods" },
    { method: "PATCH", route: "/api/foods/:id" },
    { method: "DELETE", route: "/api/foods/:id" }
]);

//middlewares
app.use(morgan("dev"));
//parsear req.body a json
app.use(express.json());

//ROUTES

// /api/foods
app.use('/api', foodRoutes);

// /ping
app.use('/ping', indexRoutes);

//respuesta a rutas no existentes
app.use((req, res) => {
    res.status(404).json({
        message: `Not found: Method: ${req.method} Route: '${req.url}' doesn't exist.`,
        availableRoutes: app.get("availableRoutes")
    })
})

export default app;
