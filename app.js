const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./database');

// models
const SitesReservas = require('./Models/SiteReserva');
const Hotel = require('./Models/Hotel');
const Promocao = require('./Models/Promocao');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {title: 'Teste Home', message: 'Welcome to the Home Page'});
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/siteReserva', require('./Routes/SiteReservaRoutes'));
app.use('/hotel', require('./Routes/HotelRoutes'));

require('./Models/Associations');
sequelize.sync({ force: true }).then(() => {
    console.log('Banco de dados sincronizado');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});