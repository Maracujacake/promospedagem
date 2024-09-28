const express = require('express');
const router = express.Router();
const siteReservaController = require('../Controllers/SiteReservaController');

const bcrypt = require('bcrypt');
const siteReserva = require('../Models/SiteReserva');
const authenticateJWT = require('../Middleware/AuthMiddleware');


// registro de novos sites de reserva
router.get('/register', (req, res) => {
    res.render('siteReserva/registroSiteReserva', {title: 'Registro de Site de Reserva'});
});

router.post('/register', async(req, res) => {
    siteReservaController.registroSiteReserva(req, res);
});



// login de sites de reserva
router.get('/login', (req, res) => {
    res.render('siteReserva/loginSiteReserva', {title: 'Login de site de Reserva'});
});

router.post('/login', async(req,res) => {
    console.log('Entrou no post de */login');
    siteReservaController.loginSiteReserva(req, res);
});



// atualização de dados de sites de reserva
router.get('/update', (req, res) => {
    res.render('siteReserva/updateSiteReserva', {title: 'atualizar dados de Site de Reserva'});
});

router.put('/update', authenticateJWT, siteReservaController.atualizarSiteReserva);



// leitura de sites de reserva
router.get('/readSites', siteReservaController.getSitesReservas);


module.exports = router;