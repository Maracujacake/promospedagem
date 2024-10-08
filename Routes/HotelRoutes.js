const express = require('express');
const router = express.Router();
const hotelController = require('../Controllers/HotelController');
const authenticateJWT = require('../Middleware/AuthMiddleware');
const siteReservaController = require('../Controllers/SiteReservaController');
const autenticarHotel = require('../Middleware/hotelAuth');

// CREATE - Registro
router.get('/register', (req, res) => {
    res.render('Hotel/registroHotel', {title: 'Registro de Hotel'});
});

router.post('/register', async(req, res) => {
    hotelController.registroHotel(req, res);
});


// LOGIN
router.get('/login', (req, res) => {
    res.render('Hotel/loginHotel', {
        title: 'Login de Hotel',
        t: req.t
    });
});

router.post('/login', async (req, res) => {
    hotelController.loginHotel(req, res);
});


// UPDATE - Atualizar informações
router.get('/update', (req, res) => {
    res.render('Hotel/updateHotel', {title: 'Atualizar Hotel'});
});

router.put('/update', autenticarHotel, hotelController.updateHotel);


// GET - Leitura de hoteis
router.get('/details', async(req, res) => {
    hotelController.getHotelByEmail(req, res);
})


// CRIAÇÃO de promoção
router.get('/criarPromocao', siteReservaController.renderizarFormularioPromocao);
router.post('/criarPromocao', autenticarHotel , hotelController.criarPromocao);



router.get('/opcoes', (req, res) => {
    res.render('Hotel/opcoesHotel', { user: req.user });
});

// Listagem de todos os hotéis
router.get('/hoteis', hotelController.getHoteis);  // Listagem de todos os hotéis

// Rota para renderizar a página de busca por cidade
router.get('/buscar-cidade', (req, res) => {
    res.render('hotelByCidade', { title: 'Buscar Hotel por Cidade' });
});
router.get('/hoteis/cidade/:cidade', hotelController.getHoteisByCidade);  // Listagem de hotéis por cidade

// leitura de todas as promoções de um hotel
router.get('/:email/promocoes', hotelController.getPromocoesByHotel);

// Deletar hotel
router.delete('/delete', autenticarHotel, hotelController.deletarHotel);


module.exports = router;