const express = require('express');
const router = express.Router();
const siteReservaController = require('../Controllers/SiteReservaController');

const bcrypt = require('bcrypt');
const siteReserva = require('../Models/SiteReserva');
const authenticateJWT = require('../Middleware/AuthMiddleware');
const autenticarSiteReserva = require('../Middleware/siteReservaAuth');


// registro de novos sites de reserva
router.get('/register', (req, res) => {
    res.render('siteReserva/registroSiteReserva', {title: 'Registro de Site de Reserva'});
});

router.post('/register', async (req, res) => {
    const resultado = await siteReservaController.registroSiteReserva(req, res);
    
    if (resultado.status === 201) {
        return res.redirect('/siteReserva/login'); // Redirecionar se o registro foi bem-sucedido
    } else {
        return res.status(resultado.status).json({ message: resultado.message }); // Retornar a mensagem de erro
    }
});


// login de sites de reserva
router.get('/login', (req, res) => {
    res.render('siteReserva/loginSiteReserva', {
        title: 'Login de site de Reserva',
        t: req.t
    });
});

router.post('/login', async(req,res) => {
    console.log('Entrou no post de */login');
    siteReservaController.loginSiteReserva(req, res);
});



// atualização de dados de sites de reserva
router.get('/update', (req, res) => {
    res.render('siteReserva/updateSiteReserva', {title: 'atualizar dados de Site de Reserva'});
});

router.put('/update', autenticarSiteReserva, siteReservaController.atualizarSiteReserva);



// leitura de sites de reserva
router.get('/readSites', siteReservaController.getSitesReservas);


// renderização da página de opções
router.get('/opcoes', (req, res) => {
    res.render('siteReserva/opcoesSiteReserva', { user: req.user });
});


// leitura de todas as promoções de um site de reserva
router.get('/:email/promocoes', siteReservaController.getPromocoesBySiteReserva);


// Deletar site de reserva
router.delete('/delete', autenticarSiteReserva, siteReservaController.deletarSiteReserva);


module.exports = router;