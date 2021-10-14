import axios from "axios";

//https://economia.awesomeapi.com.br/json/

// Rota para buscar EUR>BRL: all/EUR-BRL

const api = axios.create({
    baseURL: 'https://economia.awesomeapi.com.br/json/'
});

export default api;