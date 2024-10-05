<div align="center">
  <h2> Promospedagem 🏨 </h2>
  <img src="https://github.com/Maracujacake/promospedagem/blob/master/%C3%ADcone_de_hotel-removebg-preview.png" width="300">
  <p> O serviço que une sites de reserva e seus hotéis preferidos.</p>
</div>

### Sobre
- O sistema apresentado neste repositório busca realizar a criação de promoções de reservas em hotéis de uma maneira fácil e prática
- Conta com sistema de login (Sites, Hoteis e Administradores), Controle da criação de promoções, Checagem de valores, etc.
- Idiomas suportados:
- <img src="https://img.shields.io/badge/Português-pt_BR-green"> <img src="https://img.shields.io/badge/Ingles-en-blue">


### Índice
1. [Utilização](#utilização-do-sistema)
2. [Imagens do sistema](#imagens-do-sistema)
4. [Funcionalidades](#funcionalidades)

   
### Utilização do sistema
- Basta clonar o repositório e executar ```npm run dev``` na sua máquina
- - Caso gere conflito com alguma dependência, favor executar ```npm install```


### Imagens do sistema
<img src="https://github.com/Maracujacake/promospedagem/blob/master/373912315-0259d26e-f439-4482-a4b0-a2c278a56419.png">


<img src="https://github.com/Maracujacake/promospedagem/blob/master/imagem2.png">


### Funcionalidades
- O projeto seguiu os seguintes requisitos:
  - R1: CRUD de sites de reservas (requer login de administrador)
  - R2: CRUD de hotéis (requer login de administrador)
  - R3: Listagem de todos os hotéis em uma única página (não requer login)
  - R4: Listagem de todos os hotéis por cidade (não requer login). Preferencialmente a cidade deveria ser escolhida
 através de uma lista.
  - R5: Criação de uma promoção de um hotel (requer login do hotel via e-mail + senha). Depois de fazer login, o
 hotel pode cadastrar uma promoção. Para isso, deve escolher um site de reservas (escolhendo a partir de uma
 lista), uma data inicial/final e um preço, e deve ser gravada a promoção na base de dados.
  - R6: Listagem de todas as promoções de um hotel (requer login do hotel via e-mail + senha). Depois de fazer
 login, o hotel pode visualizar todas as suas promoções gravadas.
  - R7: O sistema não deve permitir o cadastro de promoções de um mesmo hotel ou de um mesmo site de reservas
 em uma mesma data.
  - R8: Listagem de todas as promoções de um site de reservas (requer login do site de reservas via e-mail +
 senha). Depois de fazer login, o site de reservas pode visualizar todas as suas promoções gravadas.
  - R9: O sistema deve ser internacionalizado em pelo menos dois idiomas.
  - R10: O sistema deve validar (tamanho, formato, etc) todas as informações (campos nos formulários) cadastradas
 e/ou editadas



