CREATE DATABASE IF NOT EXISTS fitplus;

USE fitplus;

CREATE TABLE alimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    calorias DECIMAL(5,2) NOT NULL,
    proteinas DECIMAL(5,2) NOT NULL,
    grasas DECIMAL(5,2) NOT NULL,
    carbohidratos DECIMAL(5,2) NOT NULL,
    fibra DECIMAL(5,2),
    azucar DECIMAL(5,2),
    sodio DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO alimentos (nombre, calorias, proteinas, grasas, carbohidratos, fibra, azucar, sodio)
 VALUES ('manzana', '80', '2', '0.5', '20.2', '2.3', '8', '80');

 