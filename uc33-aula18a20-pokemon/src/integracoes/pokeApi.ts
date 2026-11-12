import { config } from '../config.js';
import type { Pokemon } from '../entities/Pokemon.js';
import { NaoEncontrado } from '../errors/NaoEncontrado.js';
import { RegraDeNegocio } from '../errors/RegraDeNegocio.js';
import { ServicoIndisponivel } from '../errors/ServicoIndisponivel.js';

// O que a PokéAPI devolve (só os campos que usamos: a resposta inteira passa de 300 KB).
// Documentação: https://pokeapi.co/docs/v2#pokemon
interface RespostaPokeApi {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  sprites: { front_default: string | null };
}

// Aceita o nome ("Pikachu", "mr-mime") ou o número ("25") e devolve em minúsculas.
// Conferir antes de chamar evita gastar uma chamada com um texto impossível.
export function normalizarPokemon(texto: string): string {
  const chave = texto.trim().toLowerCase();
  if (!/^[a-z0-9-]{1,40}$/.test(chave)) {
    throw new RegraDeNegocio(`Pokémon "${texto}" inválido: use o nome (ex.: pikachu) ou o número (ex.: 25)`);
  }
  return chave;
}

// Regra de uso da PokéAPI: guardar localmente o que já foi buscado.
// Os dados de um Pokémon não mudam, então uma memória simples basta (ela zera quando a API reinicia).
const memoria = new Map<string, Pokemon>();

export async function buscarPokemon(informado: string): Promise<Pokemon> {
  const chave = normalizarPokemon(informado);
  const guardado = memoria.get(chave);
  if (guardado) return guardado;

  let resposta: Response;
  try {
    resposta = await fetch(`${config.pokemon.url}/api/v2/pokemon/${chave}`, {
      signal: AbortSignal.timeout(config.pokemon.tempoLimiteMs),
    });
  } catch (erro) {
    // Sem rede, serviço fora do ar ou passou do tempo limite
    console.error(`[pokeapi] falha ao chamar a PokéAPI: ${(erro as Error).message}`);
    throw new ServicoIndisponivel('A PokéAPI não respondeu. Tente de novo em instantes.');
  }

  // A PokéAPI avisa que o Pokémon não existe com 404 (o corpo é {"status":404,"message":"Not Found"})
  if (resposta.status === 404) {
    throw new NaoEncontrado(`Pokémon ${chave} não encontrado`);
  }
  if (!resposta.ok) {
    console.error(`[pokeapi] a PokéAPI respondeu ${resposta.status}`);
    throw new ServicoIndisponivel('A PokéAPI respondeu com erro. Tente de novo em instantes.');
  }

  const dados = (await resposta.json()) as RespostaPokeApi;
  const pokemon: Pokemon = {
    numero: dados.id,
    nome: dados.name,
    tipos: [...dados.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    imagem: dados.sprites.front_default,
  };
  // Guarda pelo que foi pedido, pelo nome e pelo número: "25" e "pikachu" não chamam de novo
  for (const k of [chave, pokemon.nome, String(pokemon.numero)]) memoria.set(k, pokemon);
  return pokemon;
}
