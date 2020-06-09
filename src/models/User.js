const mongoose = require('../database');
const bcrypt = require('bcryptjs');

//Campos para armazenar no Banco
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

//Encripita a senha antes de salvar no Banco
UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

//Passa para o banco
const User = mongoose.model('User', UserSchema);


module.exports = User;
