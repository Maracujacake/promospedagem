const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./database');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const i18nextFsBackend = require('i18next-fs-backend');

// models
const SitesReservas = require('./Models/SiteReserva');
const Hotel = require('./Models/Hotel');
const Promocao = require('./Models/Promocao');

// tradução
i18next
  .use(i18nextFsBackend)
  .use(i18nextMiddleware.LanguageDetector) 
  .init({
    fallbackLng: 'pt-BR',
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json'),
    },
    detection: {
      order: ['querystring', 'cookie', 'header'], // Ordem de detecção do idioma
      caches: ['cookie'], // Armazena o idioma no cookie para as próximas requisições
    },
    interpolation: {
      escapeValue: false,
    },
  });

app.use(i18nextMiddleware.handle(i18next));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));





app.get('/', (req, res) => {
  const lang = req.query.lang; // Captura o parâmetro de idioma da query string

  // Se lang estiver definido, mude a linguagem
  if (lang) {
      req.i18n.changeLanguage(lang)
          .then(() => {
              console.log('Idioma alterado para:', lang);
              res.render('index', 
                  {
                      title: 'HomePage', 
                      message: 'Welcome to the Home Page',
                      t: req.t
                  });
          })
          .catch(err => {
              console.error('Erro ao alterar idioma:', err);
              res.render('index', 
                  {
                      title: 'HomePage', 
                      message: 'Welcome to the Home Page',
                      t: req.t
                  });
          });
  } else {
      console.log('Idioma detectado:', req.language);
      res.render('index', 
          {
              title: 'HomePage', 
              message: 'Welcome to the Home Page',
              t: req.t
          });
  }
});




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/siteReserva', require('./Routes/SiteReservaRoutes'));
app.use('/hotel', require('./Routes/HotelRoutes'));
app.use('/admin', require('./Routes/AdminRoutes'));

require('./Models/Associations');
sequelize.sync({ force: false }).then(() => {
    console.log('Banco de dados sincronizado');
});




app.listen(3000, () => {
    console.log('Server is running on port 3000');
});