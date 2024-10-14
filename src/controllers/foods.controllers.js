import { pool } from "../db.js";

// Lógica para obtener todos los alimentos (metodo GET, endpoint: api/foods)
export const getFoods = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM alimentos");
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            error: "An error occurred trying to fetch the foods",
            wrong: error
        });
    }
};

// Lógica para obtener un alimento por ID (metodo GET, endpoint: api/foods/id)
export const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validación: Comprobar que el parametro ID es un número
        if (isNaN(id)) {
            return res.status(400).json({
                error: `The 'id' parameter must be a valid number. Given id: ${id}`
            });
        }
        // Consulta SQL para obtener el alimento por ID
        const [rows] = await pool.query("SELECT * FROM alimentos WHERE id = ?", [id]);

        // Verificar si se encontró el alimento
        if (rows.length === 0) {
            return res.status(404).json({
                error: "Food not found with the given ID."
            });
        }
        // Enviar el alimento encontrado
        res.status(200).json(rows[0]);

    } catch (error) {
        res.status(500).json({
            error: `An error occurred trying to fetch the food item with id: ${id} .`
        });
    }
};

// Lógica para crear un nuevo alimento (metodo POST, endpoint: api/foods)
export const createFood = async (req, res) => {
    //Si alguno parametro no se pasó por defecto es 0
    try {
        //destructurar los parametros del objeto req.body
        const { name, calories = 0, proteins = 0, fats = 0, carbs = 0, fiber = 0, sugar = 0, sodium = 0 } = req.body;

        const food = {
            name,
            calories,
            proteins,
            fats,
            carbs,
            fiber,
            sugar,
            sodium
        }

        // Validación: Comprobar que "name" es un string
        if (typeof food.name !== 'string' || food.name.trim() === '') {
            return res.status(400).json({
                error: "The 'name' field is required or invalid."
            });
        }

        // Validación: Comprobar que las calorías, proteínas, grasas, carbohidratos, fibra, azúcar y sodio son números
        const numericFields = { calories, proteins, fats, carbs, fiber, sugar, sodium };
        for (const [key, value] of Object.entries(numericFields)) {
            if (typeof value !== 'number' || isNaN(value)) {
                return res.status(400).json({
                    error: `The '${key}' field must be a valid number.`
                });
            }
        }

        // Al menos uno de los macronutrientes (proteins, fats, carbs) debe ser mayor que 0
        if (food.proteins === 0 && food.fats === 0 && food.carbs === 0) {
            return res.status(400).json({
                error: "At least one of the macronutrients (proteins, fats, carbs) must be greater than 0."
            });
        }

        //calcular calorias automaticamente
        if (food.calories === 0) {
            food.calories = food.proteins * 4 + food.carbs * 4 + food.fats * 9;
        }

        // Consulta SQL para insertar el alimento en la base de datos
        const [rows] = await pool.query(
            "INSERT INTO alimentos (nombre, calorias, proteinas, grasas, carbohidratos, fibra, azucar, sodio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [food.name, food.calories, food.proteins, food.fats, food.carbs, food.fiber, food.sugar, food.sodium]
        );

        if (rows.affectedRows > 0) {
            res.status(201).json({
                message: "Food created successfully",
                newFood: {
                    id: rows.insertId, ...food
                }
            });
        } else {
            res.status(400).json({
                message: "Tne food could not be created",
            });
        }


    } catch (error) {
        res.status(500).json({
            error: "An error occurred while creating the new food item"
        });
    }
};

// Lógica para actualizar un alimento por ID (metodo PUT, endpoint: api/foods/id)
export const updateFood = async (req, res) => {
    // Obtener el ID del alimento desde los parámetros de la URL
    const { id } = req.params;
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { name = null, calories = null, proteins = null, fats = null, carbs = null, fiber = null, sugar = null, sodium = null } = req.body;

        // Validación: Comprobar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({
                error: `The id parameter: ${id} must be a valid number.`
            });
        }

        //si algun parametro es nulo se mantiene el que ya existe en la base de datos (ifnull(null, valor existente))
        const [result] = await pool.query("UPDATE alimentos SET nombre = IFNULL(?, nombre), calorias = IFNULL(?,calorias), proteinas = IFNULL(?,proteinas), grasas = IFNULL(?,grasas), carbohidratos = IFNULL(?,carbohidratos), fibra = IFNULL(?,fibra), azucar = IFNULL(?,azucar), sodio = IFNULL(?,sodio ) WHERE id=?", [name, calories, proteins, fats, carbs, fiber, sugar, sodium, id]);

        //si no existe ninguna fila afectada es porque no se encontro el alimento
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: `The food with id: ${id} wasn't found.`
            });
        }

        //retornar alimento actualizado
        const [rows] = await pool.query("SELECT * FROM alimentos WHERE id = ?", [id]);
        const updatedFood = rows[0];

        // Lógica para actualizar un alimento por ID
        res.json({ message: `Food with ID: ${id} updated`, updatedFood });

    } catch (error) {

        res.status(500).json({
            error: `An error occurred trying to update the food item with id: ${id} .`
        });
    }

};

// Lógica para eliminar un alimento por ID (metodo DELETE, endpoint: api/foods/id)
export const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        // Validación: Comprobar que el parametro ID es un número
        if (isNaN(id)) {
            return res.status(400).json({
                error: `The 'id' parameter must be a valid number. Given id: ${id}`
            });
        }
        // Consulta SQL para obtener el alimento por ID
        const [rows] = await pool.query("SELECT * FROM alimentos WHERE id = ?", [id]);

        // Verificar si se encontró el alimento
        if (rows.length === 0) {

            return res.status(404).json({
                error: `Food not found with the given ID: ${id}`
            });

        }
        // si se encontro el alimento se elimina y se retorna el alimento
        const food = rows[0];

        const [result] = await pool.query("DELETE FROM alimentos WHERE id = ?", [id]);

        if (result.affectedRows > 0) {
            // Enviar el alimento encontrado y eliminado
            res.status(200).json(food);
        }



    } catch (error) {
        res.status(500).json({
            error: `An error occurred trying to fetch the food item with id: ${id} .`
        });
    }
};
