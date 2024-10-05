const Admin = require('./Models/Admin'); // Ajuste o caminho para o seu modelo
const bcrypt = require('bcrypt');


const cadastrarAdmin = async (id, senha) => {
    try {
        const hash = await bcrypt.hash(senha, 10);
        console.log(`Inserindo admin com ID: ${id}, senha: ${hash}`);

        await Admin.create({
            id,
            senha: hash
            // O Sequelize cuidará dos campos createdAt e updatedAt
        });

        console.log('Administrador cadastrado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar administrador:', err);
    }
};

// Exemplo de uso
(async () => {
    const id = '2'; 
    const senha = 'banana'; 
    await cadastrarAdmin(id, senha);
})();
