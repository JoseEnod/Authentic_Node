const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

//Faz a validação do Token de login e registro
module.exports = (req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({error: 'No token Provided'});
    }

    const parts = authHeader.split(' ');

    if(!parts.length === 2){
        return res.status(401).send({error: 'Token Error'});
    }

    const [sheme, token] = parts;

    if(!/^Bearer$/i.test(sheme)){
        return res.status(401).send({error: 'Token malformatted'});
    }

    jwt.verify(token, authConfig.secret, (err, decoded) =>{
        if(err) return res.status(401).send({ error: 'Token invalid'});
    
    
        req.userId = decoded.id;
        return next()
    });


};