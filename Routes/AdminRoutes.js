const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/AdminController');
const authenticateJWT = require('../Middleware/AuthMiddleware');

router.get('/login', (req, res) => {
    res.render('Admin/login', { title: 'Login de Administrador' });
});

router.post('/login', adminController.loginAdmin);

router.get('/criarPromocao', adminController.renderizarFormularioPromocao);


router.post('/criarPromocao', adminController.criarPromocao);

router.get('/opcoes', (req, res) => {
    res.render('Admin/opcoes', { user: req.user });
});


// Listagem de hotel por email
router.get('/hotelPorEmail', (req, res) => {
    res.render('Admin/hotelPorEmail', { title: 'Buscar Hotel por Email' });
});

router.post('/hotelPorEmail', adminController.listarHotelPorEmail);

// Listagem de todos os sites de reserva
router.get('/sitesReserva', adminController.listarHoteis);

// Listagem de site de reserva por email
router.get('/siteReservaPorEmail', (req, res) => {
    res.render('Admin/siteReservaPorEmail', { title: 'Buscar Site de Reserva por Email' });
});

router.post('/siteReservaPorEmail', adminController.listarSiteReservaPorEmail);


// deleção de hotel
router.get('deletarHotel', (req, res) => {
    res.render('Admin/deletarHotel', { title: 'Deletar Hotel' });
});

router.delete('/deletarHotel', adminController.deletarHotel);


// deleção de siteReserva
router.get('/deletarSiteReserva', (req, res) => {
    res.render('Admin/deletarSiteReserva', { title: 'Deletar Site de Reserva' });
});

router.delete('/deletarSiteReserva', adminController.deletarSiteReserva);

module.exports = router;