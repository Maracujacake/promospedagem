const Promocao = require('./Promocao');
const Hotel = require('./Hotel');
const SiteReserva = require('./SiteReserva');

// Relacionamentos entre as tabelas
Hotel.hasMany(Promocao, { foreignKey: 'hotelCnpj' });
SiteReserva.hasMany(Promocao, { foreignKey: 'siteReservaEmail' });

Promocao.belongsTo(Hotel, { foreignKey: 'hotelCnpj' });
Promocao.belongsTo(SiteReserva, { foreignKey: 'siteReservaEmail' });

module.exports = { Hotel, Promocao, SiteReserva };