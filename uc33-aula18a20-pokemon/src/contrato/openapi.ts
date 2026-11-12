import { DadosTreinador, DadosNoTime, Pokemon, Treinador, TreinadorComTime, Erro } from './esquemas.js';

const json = (ref: string) => ({ 'application/json': { schema: { $ref: ref } } });
const lista = (ref: string) => ({ 'application/json': { schema: { type: 'array', items: { $ref: ref } } } });
// Cada resposta de erro leva o seu próprio exemplo
const erro = (descricao: string, exemplo: string) => ({
  description: descricao,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' }, example: { erro: exemplo } } },
});
const idNaRota = { name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } };
const naoEncontrado = erro('Treinador não encontrado', 'Treinador 9 não encontrado');
const pokeApiFora = erro('A PokéAPI não respondeu', 'A PokéAPI não respondeu. Tente de novo em instantes.');

export const contrato = {
  openapi: '3.1.0',
  info: {
    title: 'API de Treinadores Pokémon',
    version: '1.0.0',
    description: 'Projeto das Aulas 18 a 20 da UC33 (SENAC RN). Treinadores e o time de cada um, com os dados dos Pokémon vindos da PokéAPI (https://pokeapi.co). Todos os erros seguem o esquema Erro.',
  },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/treinadores': {
      get: { summary: 'Lista os treinadores, com o total do time', responses: { 200: { description: 'Lista de treinadores', content: lista('#/components/schemas/Treinador') } } },
      post: {
        summary: 'Cadastra um treinador',
        requestBody: { required: true, content: json('#/components/schemas/DadosTreinador') },
        responses: {
          201: { description: 'Treinador criado', headers: { Location: { schema: { type: 'string' } } }, content: json('#/components/schemas/Treinador') },
          400: erro('Corpo fora do contrato', 'O corpo não segue o contrato'),
          409: erro('Nome já usado', 'Já existe um treinador chamado Bia'),
        },
      },
    },
    '/treinadores/{id}': {
      get: { summary: 'Busca um treinador, com o time', parameters: [idNaRota], responses: { 200: { description: 'O treinador e o time', content: json('#/components/schemas/TreinadorComTime') }, 404: naoEncontrado } },
      put: {
        summary: 'Altera nome e cidade de um treinador',
        parameters: [idNaRota],
        requestBody: { required: true, content: json('#/components/schemas/DadosTreinador') },
        responses: { 200: { description: 'Treinador alterado', content: json('#/components/schemas/Treinador') }, 400: erro('Corpo fora do contrato', 'O corpo não segue o contrato'), 404: naoEncontrado, 409: erro('Nome já usado', 'Já existe um treinador chamado Bia') },
      },
      delete: { summary: 'Apaga um treinador e o time dele', parameters: [idNaRota], responses: { 204: { description: 'Apagado, sem corpo' }, 404: naoEncontrado } },
    },
    '/treinadores/{id}/time': {
      get: { summary: 'O time do treinador', parameters: [idNaRota], responses: { 200: { description: 'Os Pokémon do time', content: lista('#/components/schemas/Pokemon') }, 404: naoEncontrado } },
      post: {
        summary: 'Põe um Pokémon no time (os dados vêm da PokéAPI)',
        parameters: [idNaRota],
        requestBody: { required: true, content: json('#/components/schemas/DadosNoTime') },
        responses: {
          201: { description: 'Pokémon no time', headers: { Location: { schema: { type: 'string' } } }, content: json('#/components/schemas/Pokemon') },
          400: erro('Corpo fora do contrato ou Pokémon que não existe', 'Pokémon naoexiste não encontrado'),
          404: naoEncontrado,
          409: erro('Time cheio ou Pokémon repetido', 'O time de Bia já tem 6 Pokémon'),
          503: pokeApiFora,
        },
      },
    },
    '/treinadores/{id}/time/{numero}': {
      delete: {
        summary: 'Tira um Pokémon do time',
        parameters: [idNaRota, { name: 'numero', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
        responses: { 204: { description: 'Tirado, sem corpo' }, 404: erro('Treinador ou Pokémon fora do time', 'O Pokémon 7 não está no time do treinador 1') },
      },
    },
    '/pokemons/{nome}': {
      get: {
        summary: 'Busca um Pokémon pelo nome ou número (consulta a PokéAPI)',
        parameters: [{ name: 'nome', in: 'path', required: true, description: 'Nome ou número', schema: { type: 'string', example: 'pikachu' } }],
        responses: {
          200: { description: 'O Pokémon', content: json('#/components/schemas/Pokemon') },
          400: erro('Texto em formato inválido', 'Pokémon "pika chu" inválido: use o nome (ex.: pikachu) ou o número (ex.: 25)'),
          404: erro('Pokémon não existe', 'Pokémon naoexiste não encontrado'),
          503: pokeApiFora,
        },
      },
    },
  },
  components: { schemas: { DadosTreinador, DadosNoTime, Pokemon, Treinador, TreinadorComTime, Erro } },
};
