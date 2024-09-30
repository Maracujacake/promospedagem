const Promocao = require('../Models/Promocao');
const SiteReserva = require('../Models/SiteReserva');
const { Sequelize, Op } = require('sequelize'); 


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

        
        const promocaoExistente = await Promocao.findOne({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('data_inicio')), data_inicio), // Compara apenas a data, ignorando a hora
                    {
                        [Op.or]: [
                            { hotelCnpj: cnpj }, // Ou para o mesmo hotel
                            { siteReservaEmail: siteReserva.email } // Ou para o mesmo site de reserva
                        ]
                    }
                ]
            }
        });
        

        // Se já houver uma promoção existente para o mesmo hotel ou site de reserva no mesmo dia, impede a criação
        if (promocaoExistente) {
            return res.status(400).json({ message: 'Já existe uma promoção para este hotel ou site de reserva nas mesmas datas.' });
        }

        console.log("PROMOCAO: ", promocaoExistente);
        console.log("DATAS: ", data_inicio, data_fim);


        // Cria a promoção
        const promocao = await Promocao.create({
            preco,
            data_inicio,
            data_fim,
            hotelCnpj: cnpj,
            siteReservaEmail: siteReserva.email
        });

        // Retorna a promoção criada
        return res.status(201).json(promocao);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao criar promoção', err });
    }
};

module.exports = {
    criarPromocao
};
