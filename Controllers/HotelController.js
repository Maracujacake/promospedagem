const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hotel = require('../Models/Hotel');
const promocaoController = require('./PromocaoController');

// Registro de Hotel
const registroHotel = async (req, res) => {
    console.log(req.body);
    const { email, senha, nome, cnpj, cidade } = req.body;

    try {
        const cnpjExistente = await hotel.findOne({ where: { cnpj } });
        const emailExistente = await hotel.findOne({ where: { email } });
        if (cnpjExistente || emailExistente) {
            // Retorna um erro se CNPJ ou email já estiverem em uso
            return res.status(409).json({ message: 'CNPJ ou Email já estão em uso' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoHotel = await hotel.create({ email, senha: senhaCriptografada, nome, cnpj, cidade });

        // Redireciona para a página de login após o registro bem-sucedido
        return res.redirect('/hotel/login'); // Altere o caminho conforme necessário
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Erro ao realizar cadastro', err });
    }
}

// Login de Hotel
const loginHotel = async(req, res) => {
    const { email, senha } = req.body;

    try{
        const Hotel = await hotel.findOne({where : {email}});
        if(!Hotel){
            return res.status(404).json({ message: 'Hotel não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, Hotel.senha);
        if(!senhaValida){
            return res.status(401).json({message: 'Senha inválida'});
        }
        const payload = {
            email: Hotel.email,
            cnpj: Hotel.cnpj,
            userType: 'hotel'
        }
        const token = jwt.sign(payload, 'secret', {expiresIn: '1h'});

        res.json({message: 'Login bem suciedido', token});
    }
    catch(err){
        return res.status(500).json({message: 'Erro ao realizar login', err});
    }
}

// Atualizar informações de Hotel
const updateHotel = async (req, res) => {

    // le o token
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    // pega info do body
    const {email, senha, nome, cidade} = req.body;


    try{
        const decoded = jwt.verify(token, 'secret');
        const cnpj = decoded.cnpj;
        console.log('CNPXOTA', cnpj);
        const Hotel = await hotel.findOne({where: {cnpj}});
        if(!Hotel){
            return res.status(404).json({message: 'Hotel não encontrado'});
        }

        let senhaCriptografada;
        if(senha){
            senhaCriptografada = await bcrypt.hash(senha, 10);
        }

        await Hotel.update({
            senha: senhaCriptografada || Hotel.senha,
            nome: nome || Hotel.nome,
            email: email || Hotel.email,
            cidade: cidade || Hotel.cidade
        });

        await Hotel.save();
        res.json({message: 'Hotel atualizado com sucesso'});
    }
    catch(err){
        return res.status(500).json({message: 'Erro ao atualizar hotel', err});
    }
}


// GET - Leitura de hoteis
const getHotelByEmail = async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try{
        const decoded = jwt.verify(token, 'secret');
        const email = decoded.email; 
        console.log(email);
        const hotelos = await hotel.findOne({where: {email}});
        
        res.json({
            email: hotelos.email,
            cnpj: hotelos.cnpj,
            nome: hotelos.nome,
            cidade: hotelos.cidade,
        })
    }
    catch(error){
        console.log('Erro ao buscar hotel', error);
        res.status(500).json({message: 'Erro ao buscar hotel', error});
    }
}

const criarPromocao = async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    try{
        const decoded = jwt.verify(token, 'secret');
        const cnpj = decoded.cnpj;
        const promocao = await promocaoController.criarPromocao(req, res, cnpj);
        res.json(promocao);
    }
    catch(err){
        return res.status(500).json({message: 'Erro ao criar promocao', err});
    }
}

module.exports = {
    registroHotel,
    loginHotel,
    updateHotel,
    getHotelByEmail,
    criarPromocao
};