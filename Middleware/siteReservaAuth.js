const jwt = require('jsonwebtoken');

const autenticarSiteReserva = (req, res, next) => {
    console.log("TOLKIEN RS: ", req.headers['authorization']);
    const token = req.headers['authorization']?.split(' ')[1];
    

    if (!token) {
        return res.status(403).json({ message: 'Autenticação necessária' });
    }

    try {
        // Verifica e decodifica o token JWT
        const decoded = jwt.verify(token, 'secret');

        // Verifica se o usuário é siteReserva
        if (decoded.userType !== 'siteReserva') {
            return res.status(403).json({ message: 'Acesso negado: apenas siteReserva podem acessar esta página' });
        }

        // Armazena os dados decodificados do token no objeto req para uso futuro
        req.user = decoded;
        next(); // Permite o acesso à rota
    } catch (err) {
        console.error('Erro na verificação do token:', err.name, err.message);
        return res.status(401).json({ message: 'Token inválido ou expirado', error: err.message });
    }
};

module.exports =  autenticarSiteReserva;