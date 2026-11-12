 // Integração com a PokéAPI: só este arquivo conhece o endereço dela.
 const URL_BASE = 'https://pokeapi.co/api/v2';
 const TEMPO_LIMITE_MS = 5000;
 const NOME_VALIDO = /^[a-z0-9-]{1,40}$/;
 
 // O que a nossa API devolve (o contrato).
 export interface Pokemon {
 numero: number;
 nome: string;
 tipos: string[];
 imagem: string | null;
 }
 
 // Só a parte da resposta da PokéAPI que usamos.
 interface RespostaPokeApi {
 id: number;
 name: string;
 types: { type: { name: string } }[];
 sprites: { front_default: string | null };
 }
 
 const cache = new Map<string, Pokemon>();
 
 export class ErroDaApi extends Error {
 constructor(public readonly status: number, mensagem: string) {
   super(mensagem);
 }
 }
 
 function normalizar(termo: string): string {
 const nome = termo.trim().toLowerCase();
 if (!NOME_VALIDO.test(nome)) {
   throw new ErroDaApi(400, `Pokémon "${termo}" inválido: use o nome (ex.: pikachu) ou o número (ex.: 25)`);
 }
 return nome;
 }
 
 function resumir(dados: RespostaPokeApi): Pokemon {
 return {
   numero: dados.id,
   nome: dados.name,
   tipos: dados.types.map((t) => t.type.name),
   imagem: dados.sprites.front_default,
 };
 }
 
 export async function buscarPokemon(termo: string): Promise<Pokemon> {
 const nome = normalizar(termo);
 const guardado = cache.get(nome);
 if (guardado) return guardado;
 
 let resposta: Response;
 try {
   resposta = await fetch(`${URL_BASE}/pokemon/${encodeURIComponent(nome)}`, { signal: AbortSignal.timeout(TEMPO_LIMITE_MS) });
 } catch {
   throw new ErroDaApi(503, 'A PokéAPI não respondeu. Tente de novo em instantes.');
 }
 if (resposta.status === 404) throw new ErroDaApi(404, `Pokémon ${nome} não encontrado`);
 if (!resposta.ok) throw new ErroDaApi(503, 'A PokéAPI está com problemas. Tente de novo em instantes.');
 
 const pokemon = resumir((await resposta.json()) as RespostaPokeApi);
 cache.set(nome, pokemon);
 cache.set(String(pokemon.numero), pokemon);
 return pokemon;
 }