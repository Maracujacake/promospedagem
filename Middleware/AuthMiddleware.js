const jwt = require('jsonwebtoken');

// isso aqui espera o token como parte do cabeçalho, blz?
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Autenticação necessária. Token não fornecido.' });
    }

    jwt.verify(token, 'secret', (err, usr) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = usr;
        next();
    });
}


module.exports =  authMiddleware;
