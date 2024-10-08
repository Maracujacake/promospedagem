const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/AdminController');
const authenticateJWT = require('../Middleware/AuthMiddleware');
const autenticarAdmin = require('../Middleware/adminAuth');

router.get('/login', (req, res) => {
    res.render('Admin/login', { title: 'Login de Administrador' });
});

router.post('/login', adminController.loginAdmin);

// CREATE - C
router.get('/criarPromocao', adminController.renderizarFormularioPromocao);

router.post('/criarPromocao', autenticarAdmin, adminController.criarPromocao);



// READ - R

router.get('/promocoes', adminController.listarPromocoes);

router.get('/opcoes', (req, res) => {
    res.render('Admin/opcoes', { user: req.user });
});


router.get('/hoteis', adminController.listarHoteis);

// Listagem de hotel por email
router.get('/hotelPorEmail', (req, res) => {
    res.render('Admin/hotelPorEmail', { title: 'Buscar Hotel por Email' });
});

router.post('/hotelPorEmail', adminController.listarHotelPorEmail);



// Listagem de todos os sites de reserva
router.get('/sitesReserva', adminController.listarSitesReserva);



// Listagem de site de reserva por email
router.get('/siteReservaPorEmail', (req, res) => {
    res.render('Admin/siteReservaPorEmail', { title: 'Buscar Site de Reserva por Email' });
});
router.post('/siteReservaPorEmail', adminController.listarSiteReservaPorEmail);



// UPDATE - U

router.get('/hoteis/:email/editar', adminController.editarHotel);

router.post('/hoteis/atualizar', autenticarAdmin , async (req, res) => {
    console.log('Chegou na rota de atualização', req.body); // Log da requisição
    await adminController.updateHotel(req, res);
});

router.get('/sitesReserva/:email/editar', adminController.editarSiteReserva);

router.post('/sitesReserva/atualizar', autenticarAdmin, async (req, res) => {
    await adminController.atualizarSiteReserva(req, res);
});

// DELETE - D


router.post('/hoteis/:email/deletar', autenticarAdmin, adminController.deletarHotel);

router.post('/sitesReserva/:email/deletar', autenticarAdmin, adminController.deletarSiteReserva);

module.exports = router;