// Esquemas do contrato. Os mesmos objetos servem para a documentação
// (OpenAPI) e para validar o corpo das requisições (Ajv).

export const DadosTreinador = {
  type: 'object',
  additionalProperties: false,
  required: ['nome', 'cidade'],
  properties: {
    nome: { type: 'string', minLength: 2, maxLength: 60, example: 'Bia' },
    cidade: { type: 'string', minLength: 2, maxLength: 60, example: 'Natal' },
  },
} as const;

export const DadosNoTime = {
  type: 'object',
  additionalProperties: false,
  required: ['pokemon'],
  properties: {
    pokemon: { type: 'string', minLength: 1, maxLength: 40, example: 'pikachu', description: 'Nome ou número do Pokémon' },
  },
} as const;

export const Pokemon = {
  type: 'object',
  properties: {
    numero: { type: 'integer', example: 25 },
    nome: { type: 'string', example: 'pikachu' },
    tipos: { type: 'array', items: { type: 'string' }, example: ['electric'] },
    imagem: { type: ['string', 'null'], example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  },
} as const;

export const Treinador = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    nome: { type: 'string', example: 'Bia' },
    cidade: { type: 'string', example: 'Natal' },
    totalPokemon: { type: 'integer', example: 2 },
  },
} as const;

export const TreinadorComTime = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    nome: { type: 'string', example: 'Bia' },
    cidade: { type: 'string', example: 'Natal' },
    time: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } },
  },
} as const;

export const Erro = {
  type: 'object',
  required: ['erro'],
  properties: {
    erro: { type: 'string' },
    detalhes: { type: 'array', items: { type: 'string' } },
  },
} as const;
