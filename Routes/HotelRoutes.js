const express = require('express');
const router = express.Router();
const hotelController = require('../Controllers/HotelController');
const authenticateJWT = require('../Middleware/AuthMiddleware');
const siteReservaController = require('../Controllers/SiteReservaController');

// CREATE - Registro
router.get('/register', (req, res) => {
    res.render('Hotel/registroHotel', {title: 'Registro de Hotel'});
});

router.post('/register', async(req, res) => {
    hotelController.registroHotel(req, res);
});


// LOGIN
router.get('/login', (req, res) => {
    res.render('Hotel/loginHotel', {title: 'Login de Hotel'});
});

router.post('/login', async (req, res) => {
    hotelController.loginHotel(req, res);
});


// UPDATE - Atualizar informações
router.get('/update', (req, res) => {
    res.render('Hotel/updateHotel', {title: 'Atualizar Hotel'});
});

router.put('/update', authenticateJWT, hotelController.updateHotel);


// GET - Leitura de hoteis
router.get('/details', async(req, res) => {
    hotelController.getHotelByEmail(req, res);
})


// CRIAÇÃO de promoção
router.get('/criarPromocao', siteReservaController.renderizarFormularioPromocao);
router.post('/criarPromocao', hotelController.criarPromocao);
module.exports = router;