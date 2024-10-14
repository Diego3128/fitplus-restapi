import { Router } from "express";

import {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
} from '../controllers/foods.controllers.js';

const router = Router();



// Ruta para obtener todos los alimentos (metodo GET: endpoint: API/foods)
router.get('/foods', getFoods);

// Ruta para obtener un alimento por ID (metodo GET: endpoint: API/foods/id)
router.get('/foods/:id', getFoodById);

// Ruta para crear un nuevo alimento (metodo POST: endpoint: API/foods)
router.post('/foods', createFood);

// Ruta para actualizar un alimento por ID (metodo PATCH: endpoint: API/foods/id)
router.patch('/foods/:id', updateFood);

// Ruta para eliminar un alimento por ID (metodo DELETE: endpoint: API/foods/id)
router.delete('/foods/:id', deleteFood);

export default router;