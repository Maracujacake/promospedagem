const siteReserva = require('../Models/SiteReserva');
const Promocao = require('../Models/Promocao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// realização de login por meio de email e senha
const loginSiteReserva = async (req, res) => {
    const { email, senha } = req.body;
    console.log('Email : ', email, 'Senha : ', senha);
    if(!email || !senha){
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    try{
        const site = await siteReserva.findOne({where: {email} });
        if(!site){
            return res.status(404).json({ message: 'Site de reserva não existente' });
        }

        const senhaValida = await bcrypt.compare(senha, site.senha);
        if(!senhaValida){
            return res.status(401).json({ message: 'Senha inválida' });
        }
        payload = {
            email: site.email,
            userType: 'siteReserva'
        }

        const token = jwt.sign(payload, 'secret', {expiresIn: '1h'});
        res.json({
            message: 'Login bem sucedido',
            token
        })
    }
    catch (error) {
        console.error('Erro ao realizar login:', error); // Log do erro
        return res.status(500).json({ message: 'Erro interno' });
    }
};


// registro de um novo site de reserva
const registroSiteReserva = async (req, res) => {
    const {email, senha, nomeSite, telefone, urlSite} = req.body;

    try{

        const siteExistente = await siteReserva.findOne({where: {email} });
        if(siteExistente){
            return res.status(409).json({ message: 'Email já está em uso' });
        }
        
        
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const site = await siteReserva.create({email, senha: senhaCriptografada, nomeSite, telefone, urlSite});
        return { status: 201, site };
    }
    catch(error){
        console.log(error);
        return { status: 500, message: 'Erro ao realizar cadastro' };
    }
}


// atualização de um site de reserva
const atualizarSiteReserva = async (req, res) => {
    console.log(req.user);
    const { email } = req.user;
    const {senha, nomeSite, telefone, urlSite} = req.body;

    try{
        const site = await siteReserva.findOne({where: {email} });
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
        res.json({message: 'Site de reserva atualizado com sucesso'});
    }
    catch{
        return res.status(500).json({ message: 'Erro ao atualizar site de reserva' });
    }
}

// busca de todos os sites de reserva
const getSitesReservas = async (req, res) => {
    try{
        const sites = await siteReserva.findAll();
        res.json(sites);
    }
    catch{
        return res.status(500).json({ message: 'Erro ao buscar sites de reserva' });
    }
}


// Função para renderizar o formulário de promoção
const renderizarFormularioPromocao = async (req, res) => {
    try {
        // Busca todos os sites de reserva no banco de dados
        const sitesReserva = await siteReserva.findAll(); 
        console.log(sitesReserva);

        // Renderiza a página EJS e passa os sites de reserva
        res.render('Hotel/criarPromocao', { sitesReserva });
    } catch (error) {
        console.error('Erro ao buscar sites de reserva', error);
        res.status(500).send('Erro ao carregar o formulário');
    }
};


// Busca todas as promoções de um site de reserva
const getPromocoesBySiteReserva = async (req, res) => {
    const { email } = req.params;

    try {
        // Busca o site de reserva pelo email
        const SiteReserva = await siteReserva.findOne({ where: { email } });

        if (!SiteReserva) {
            return res.status(404).json({ message: 'Site de reserva não encontrado.' });
        }

        // Busca todas as promoções relacionadas ao site de reserva
        const promocoes = await Promocao.findAll({
            where: {
                siteReservaEmail: email
            }
        });

        if (!promocoes) {
            return res.status(404).json({ message: 'Nenhuma promoção encontrada.' });
        }

        // Retorna as promoções encontradas
        return res.status(200).render('siteReserva/promocoesSiteReserva', { promocoes });
    } catch (error) {
        console.error('Erro ao buscar promoções:', error);
        return res.status(500).json({ message: 'Erro ao buscar promoções.' });
    }
};

// Deleta um site de reserva
const deletarSiteReserva = async (req, res) => {
    const email = req.user.email; // Email extraído do token JWT
    console.log(email);

    try {
        // Busca o site de reserva pelo email
        const SiteReserva = await siteReserva.findOne({ where: { email } });

        if (!SiteReserva) {
            return res.status(404).json({ message: 'Site de reserva não encontrado.' });
        }

        // Deleta o site de reserva
        await SiteReserva.destroy();

        return res.status(200).json({ message: 'Site de reserva deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar site de reserva:', error);
        return res.status(500).json({ message: 'Erro ao deletar site de reserva.' });
    }
};


module.exports = {
    registroSiteReserva,
    loginSiteReserva,
    atualizarSiteReserva,
    getSitesReservas,
    renderizarFormularioPromocao,
    getPromocoesBySiteReserva,
    deletarSiteReserva
}