const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, Op } = require('sequelize');
const Admin = require('../Models/Admin'); // Modelo do Admin
const Hotel = require('../Models/Hotel'); // Modelo do Hotel
const SiteReserva = require('../Models/SiteReserva'); // Modelo do Site de Reserva
const Promocao = require('../Models/Promocao'); // Modelo da Promoção


// Login do Administrador
const loginAdmin = async (req, res) => {
    const { id, senha } = req.body;

    try {
        const admin = await Admin.findOne({ where: { id } });
        if (!admin) {
            return res.status(404).json({ message: 'Administrador não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, admin.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        const payload = {
            id: admin.id,
            userType: 'admin'
        };
        const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido', token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Erro ao realizar login', err });
    }
};

// CREATE - C

// Cria promoção
const criarPromocao = async (req, res) => {
    const {email, preco, data_inicio, data_fim, url_site} = req.body;
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

        const hotel = await Hotel.findOne({where: {email}});
        cnpj = hotel.cnpj;

        
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
}


// READ - R

// Lista todos os hotéis
const listarHoteis = async (req, res) => {
    try {
        // Busca todos os hotéis
        const hoteis = await Hotel.findAll();
        
        // Renderiza o template EJS com a lista de hotéis
        res.render('admin/hoteis', { hoteis });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar hotéis', err });
    }
};


// Lista hotel por email
const listarHotelPorEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const hotel = await Hotel.findOne({ where: { email } });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel não encontrado' });
        }

        res.json(hotel);
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar hotel', err });
    }
}


// Lista todos os sites reserva
const listarSitesReserva = async (req, res) => {
    try {
        const sites = await SiteReserva.findAll();
        res.render('admin/sitesReserva', { sites });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar sites de reserva', err });
    }
}

// Lista site reserva por email
const listarSiteReservaPorEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const site = await siteReserva.findOne({ where: { email } });
        if (!site) {
            return res.status(404).json({ message: 'Site de reserva não encontrado' });
        }

        res.json(site);
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar site de reserva', err });
    }
}

const renderizarFormularioPromocao = async (req, res) => {
    try {
        const [hotels, sitesReserva] = await Promise.all([
            Hotel.findAll(),
            SiteReserva.findAll()
        ]);
        console.log(hotels, sitesReserva);

        res.render('Admin/criarPromocao', { hotels, sitesReserva });
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        res.status(500).send('Erro ao carregar o formulário');
    }
};


const listarPromocoes = async (req, res) => {
    try {
        // Busca todas as promoções
        const promocoes = await Promocao.findAll();

        // Para cada promoção, buscamos o hotel e o site de reserva
        const promocoesComDetalhes = await Promise.all(
            promocoes.map(async (promocao) => {
                const hotel = await Hotel.findOne({
                    where: { cnpj: promocao.hotelCnpj },
                    attributes: ['nome'], // Pegamos apenas o nome do hotel
                });

                const siteReserva = await SiteReserva.findOne({
                    where: { email: promocao.siteReservaEmail },
                    attributes: ['urlSite'], // Pegamos apenas a URL do site de reserva
                });

                // Adicionamos o nome do hotel e a URL do site na promoção
                return {
                    ...promocao.toJSON(),
                    hotelNome: hotel ? hotel.nome : 'N/A',
                    siteUrl: siteReserva ? siteReserva.urlSite : 'N/A',
                };
            })
        );

        // Renderizando o template com as promoções e suas informações associadas
        res.render('admin/promocoes', { promocoes: promocoesComDetalhes });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar promoções', err });
    }
};




// UPDATE - U

// Renderiza o formulário de edição de um hotel encontrado pelo email
const editarHotel = async (req, res) => {
    const { email } = req.params;  // Obtém o email da URL
    try {
        const hotel = await Hotel.findOne({ where: { email } });

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel não encontrado' });
        }

        // Renderiza o formulário de edição, passando os dados do hotel
        res.render('admin/editarHotel', { hotel });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao buscar hotel', err });
    }
};


// atualiza hotel dado o Email
const updateHotel = async(req, res) => {   
    try{
        // pega info do body
        console.log('Request Body:', req.body);
        const { email, senha, nome, cidade} = req.body;
        const hotel = await Hotel.findOne({where: {email}});
        if(!hotel){
            return res.status(404).json({message: 'hotel não encontrado'});
        }

        let senhaCriptografada;
        if(senha){
            senhaCriptografada = await bcrypt.hash(senha, 10);
        }

        await hotel.update({
            senha: senhaCriptografada || hotel.senha,
            nome: nome || hotel.nome,
            email: email || hotel.email,
            cidade: cidade || hotel.cidade
        });
        await hotel.save();
        res.redirect('/admin/hoteis');
    }
    catch(err){
        console.error(err); // Log do erro no console
        return res.status(500).json({message: 'Erro ao atualizar hotel', err});
    }
}

// Renderiza o formulário de edição de um hotel encontrado pelo email
const editarSiteReserva = async (req, res) => {
    const { email } = req.params; 
    try {
        const site = await SiteReserva.findOne({ where: { email } });

        if (!site) {
            return res.status(404).json({ message: 'Site não encontrado' });
        }

        res.render('admin/editarSiteReserva', { site });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao buscar site', err });
    }
};

// atualiza siteReserva dado o email
const atualizarSiteReserva = async (req, res) => {
    console.log(req.user);
    const {email, senha, nomeSite, telefone, urlSite} = req.body;

    try{
        const site = await SiteReserva.findOne({where: {email} });
        if(!site){
            return res.status(404).json({ message: 'Site de reserva não existente' });
        }

        let senhaCriptografada;
        if(senha){
            senhaCriptografada = await bcrypt.hash(senha, 10);
        }

        await site.update({
            senha: senhaCriptografada || site.senha,
            nomeSite: nomeSite || site.nomeSite,
            telefone: telefone || site.telefone,
            urlSite: urlSite || site.urlSite
        });

        await site.save();
        res.redirect('/admin/sitesReserva');
    }
    catch{
        return res.status(500).json({ message: 'Erro ao atualizar site de reserva' });
    }
}


// DELETE - D

//deleta um hotel dado o email
const deletarHotel = async (req, res) => {
    const { email } = req.params;

    try{
        const hotel = await Hotel.findOne({where: {email}});
        if(!hotel){
            return res.status(404).json({ message: 'Hotel não encontrado' });
        }

        await hotel.destroy();
        res.redirect('/admin/hoteis'); 
    }
    catch{
        return res.status(500).json({ message: 'Erro ao deletar hotel' });
    }
}


//deleta um siteReserva dado o email
const deletarSiteReserva = async (req, res) => {
    const { email } = req.params;

    try{
        const site = await SiteReserva.findOne({where: {email}});
        if(!site){
            return res.status(404).json({ message: 'Site de reserva não encontrado' });
        }

        await site.destroy();
        res.redirect('/admin/sitesReserva'); 
    }
    catch{
        return res.status(500).json({ message: 'Erro ao deletar site de reserva' });
    }
}

module.exports = {
    loginAdmin,
    criarPromocao,
    listarHoteis,
    listarHotelPorEmail,
    listarSitesReserva,
    listarSiteReservaPorEmail,
    renderizarFormularioPromocao,
    listarPromocoes,
    atualizarSiteReserva,
    updateHotel,
    editarSiteReserva,
    deletarHotel,
    deletarSiteReserva,
    editarHotel
};
