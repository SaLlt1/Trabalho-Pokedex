// Tudo o que fala com a NOSSA API fica aqui. A página nunca chama a PokéAPI direto.
// Na rede do laboratório, troque localhost pelo IP do computador que roda a API.
export const API = 'http://localhost:3000/api/v1';

// Erro que a API devolveu (4xx ou 5xx), com a mensagem e os detalhes do corpo
export class ErroDaApi extends Error {
  constructor(status, corpo) {
    super(corpo.erro ?? `Erro ${status}`);
    this.status = status;
    this.detalhes = corpo.detalhes ?? [];
  }
}

// Faz a chamada e trata os três finais possíveis: deu certo, a API recusou, ninguém respondeu
async function pedir(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API}${caminho}`, { ...opcoes, signal: AbortSignal.timeout(8000) });
  } catch {
    throw new Error('A API não respondeu. Confira se ela está ligada e se o endereço está certo.');
  }
  if (resposta.status === 204) return null;
  const dados = await resposta.json();
  if (!resposta.ok) throw new ErroDaApi(resposta.status, dados);
  return dados;
}

const comJson = (metodo, corpo) => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(corpo),
});

export const listarTreinadores = () => pedir('/treinadores');
export const buscarTreinador = (id) => pedir(`/treinadores/${id}`);
export const criarTreinador = (dados) => pedir('/treinadores', comJson('POST', dados));
export const atualizarTreinador = (id, dados) => pedir(`/treinadores/${id}`, comJson('PUT', dados));
export const removerTreinador = (id) => pedir(`/treinadores/${id}`, { method: 'DELETE' });

export const buscarPokemon = (nome) => pedir(`/pokemons/${encodeURIComponent(nome)}`);
export const adicionarAoTime = (id, pokemon) => pedir(`/treinadores/${id}/time`, comJson('POST', { pokemon }));
export const tirarDoTime = (id, numero) => pedir(`/treinadores/${id}/time/${numero}`, { method: 'DELETE' });
