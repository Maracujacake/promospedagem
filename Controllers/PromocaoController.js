const Promocao = require('../Models/Promocao');
const SiteReserva = require('../Models/SiteReserva');

const criarPromocao = async (req, res, cnpj) => {
    const { preco, data_inicio, data_fim, url_site } = req.body;
    try {
        // Verifica se a URL do site de reserva foi enviada
        if (!url_site) {
            return res.status(400).json({ message: 'URL do site de reserva não foi fornecida' });
        }

        // Busca o site de reserva pelo URL
        const siteReserva = await SiteReserva.findOne({ where: { urlSite: url_site } });

        // Verifica se o site de reserva foi encontrado
        if (!siteReserva) {
            return res.status(404).json({ message: 'Site de reserva não encontrado' });
        }

        // Cria a promoção
        const promocao = await Promocao.create({
            preco,
            data_inicio,
            data_fim,
            hotelCnpj: cnpj,
            siteReservaEmail: siteReserva.email
        });

        // Retorna a promoção criada
        res.json(promocao);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao criar promoção', err });
    }
};

module.exports = {
    criarPromocao
};
