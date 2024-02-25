const express = require('express');
const Web3 = require('web3');
const app = express();
const port = 3000;

// Conexión a la red Ethereum
const web3 = new Web3('URL_DEL_NODO_DE_ETH');

// Importa el ABI del contrato inteligente
const contractABI = require('../build/contracts/TasksContract.json');
const contractAddress = 'DIRECCION_DEL_CONTRATO';

// Instancia del contrato inteligente
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Endpoint para obtener todas las tareas
app.get('/tasks', async (req, res) => {
    try {
        const tasksCounter = await contract.methods.tasksCounter().call();
        const tasks = [];

        for (let i = 1; i <= tasksCounter; i++) {
            const task = await contract.methods.tasks(i).call();
            tasks.push(task);
        }

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor API corriendo en http://localhost:${port}`);
});
