const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch(error){
        res.status(500).json({ message: error.message});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if(!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({ message: "Invalid password"});
        }

        const token = jwt.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.json({token, user: {id: user.id, username: user.username, email: user.email}});
    } catch (error){
        res.status(500).json({message: error.message});
    }
};

module.exports = { register, login };