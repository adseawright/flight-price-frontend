# Flight Price Predictor - Frontend

Este é o repositório do **frontend** do projeto **Flight Price Predictor**. O objetivo deste projeto é fornecer uma interface amigável para que os usuários possam prever o preço de passagens aéreas com base em dados fornecidos, como a companhia aérea, cidades de origem e destino, duração do voo, e outras características.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Axios**: Utilizado para fazer chamadas HTTP ao backend.
- **CSS**: Para estilização básica do layout.
- **HTML5**: Estrutura básica das páginas.

## Estrutura de Arquivos

- **`src/components/FlightForm.js`**:  
  Este é o componente principal do formulário, onde os usuários inserem detalhes do voo. Ele busca dinamicamente dados do backend (como companhias aéreas, cidades, e opções de paradas) e envia as informações para gerar a previsão do preço da passagem.

- **`src/services/api.js`**:  
  Contém as funções que fazem as requisições HTTP ao backend para obter dados sobre voos, companhias aéreas, cidades, etc. Utiliza o Axios para comunicação com a API.

- **`public/index.html`**:  
  O arquivo HTML principal que carrega o aplicativo React.

- **`src/index.js`**:  
  Ponto de entrada da aplicação React. É onde o aplicativo é inicializado e o componente `FlightForm` é renderizado na página.


Este projeto foi criado com o Create React App

