const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400, //tempo de validade do token || esse valor é pra 1 dia
    });
}

//Registro do usuario
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {

        if (await User.findOne({ email })) { //Valida se o email ja foi cadastrado
            return res.status(400).send({ error: 'User Already exists' });
        }

        const user = await User.create(req.body);
        user.password = undefined;  //Tira a senha do retorno

        return res.send({
            user,
            token: generateToken({ id: user.id })
        });

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});


router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await (await User.findOne({ email }).select('+password'));

    if (!user) {
        return res.status(400).send({ error: 'User not Found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Invalid password' });
    }

    user.password = undefined;  //Tira a senha do return

    res.send({
        user,
        token: generateToken({ id: user.id })
    });
});

module.exports = app => app.use('/auth', router);