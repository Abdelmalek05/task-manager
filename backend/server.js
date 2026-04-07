const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/db.js');
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes');


const app = express();

pool.query('SELECT 1')
    .then(() => console.log('Neon PostgreSQL connected'))
    .catch((err) => console.error('Database connection check failed:', err.message));

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
});


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});