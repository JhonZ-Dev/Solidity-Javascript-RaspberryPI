const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3100;

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tesisblock'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

// Ruta para guardar datos en la base de datos
// Ruta para guardar datos en la base de datos
// Ruta para guardar datos en la base de datos
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;
    
    // Ejecutar consulta SQL para verificar si ya existe una tarea con el mismo título
    const sqlCheck = `SELECT * FROM tasks WHERE title = '${title}'`;
    connection.query(sqlCheck, (err, results) => {
      if (err) {
        console.error('Error al verificar la existencia de la tarea en la base de datos:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
      
      // Si ya existe una tarea con el mismo título, actualizar el registro existente
      if (results.length > 0) {
        const taskId = results[0].id;
        const sqlUpdate = `UPDATE tasks SET description = '${description}' WHERE id = ${taskId}`;
        connection.query(sqlUpdate, (err, result) => {
          if (err) {
            console.error('Error al actualizar la tarea en la base de datos:', err);
            res.status(500).send('Error interno del servidor');
            return;
          }
          console.log('Tarea actualizada correctamente en la base de datos');
          res.status(200).send('Tarea actualizada correctamente');
        });
      } else {
        // Si no existe una tarea con el mismo título, insertar la nueva tarea
        const sqlInsert = `INSERT INTO tasks (title, description) VALUES ('${title}', '${description}')`;
        connection.query(sqlInsert, (err, result) => {
          if (err) {
            console.error('Error al insertar datos en la base de datos:', err);
            res.status(500).send('Error interno del servidor');
            return;
          }
          console.log('Datos insertados correctamente en la base de datos');
          res.status(200).send('Datos insertados correctamente');
        });
      }
    });
  });
  // Ruta para obtener una tarea específica por su ID
app.get('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
  
    // Ejecutar consulta SQL para obtener la tarea por su ID
    const sql = `SELECT * FROM tasks WHERE id = ${taskId}`;
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error al obtener la tarea de la base de datos:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
  
      // Verificar si se encontró la tarea
      if (results.length === 0) {
        res.status(404).send('Tarea no encontrada');
        return;
      }
  
      // Enviar la tarea como respuesta
      const task = results[0];
      res.status(200).json(task);
    });
  });
  
  
  

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
