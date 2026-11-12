import 'dotenv/config';

// Lê uma variável obrigatória. Se faltar, o servidor nem sobe, e a mensagem diz qual é.
function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Falta a variável de ambiente ${nome}. Confira o arquivo .env`);
  }
  return valor;
}

// Todas as configurações do serviço em um lugar só
export const config = {
  porta: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? 'localhost',
  origens: (process.env.CORS_ORIGENS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
  // PokéAPI. Sem internet no laboratório, aponte para o simulador: http://localhost:3005
  pokemon: {
    url: process.env.POKEAPI_URL ?? 'https://pokeapi.co',
    tempoLimiteMs: Number(process.env.POKEAPI_TEMPO_LIMITE_MS ?? 3000),
  },
  banco: {
    host: obrigatoria('DB_HOST'),
    port: Number(process.env.DB_PORT ?? 3306),
    user: obrigatoria('DB_USER'),
    password: obrigatoria('DB_PASSWORD'),
    database: obrigatoria('DB_NAME'),
  },
};
