import { TimeRepository } from '../repositories/TimeRepository.js';
import { TreinadorService } from './TreinadorService.js';
import { buscarPokemon } from '../integracoes/pokeApi.js';
import { NaoEncontrado } from '../errors/NaoEncontrado.js';
import { RegraDeNegocio } from '../errors/RegraDeNegocio.js';
import { Conflito } from '../errors/Conflito.js';

export const TAMANHO_DO_TIME = 6;

export class TimeService {
  constructor(
    private repositorio = new TimeRepository(),
    private treinadores = new TreinadorService(),
  ) {}

  async listar(treinadorId: number) {
    await this.treinadores.buscarPorId(treinadorId); // 404 se o treinador não existe
    return this.repositorio.listar(treinadorId);
  }

  // As regras do nosso banco vêm ANTES da chamada à PokéAPI: não gasta chamada com um pedido que seria recusado
  async adicionar(treinadorId: number, nomeOuNumero: string) {
    const treinador = await this.treinadores.buscarPorId(treinadorId);
    if ((await this.repositorio.contar(treinadorId)) >= TAMANHO_DO_TIME) {
      throw new Conflito(`O time de ${treinador.nome} já tem ${TAMANHO_DO_TIME} Pokémon`);
    }
    const pokemon = await this.buscarNaPokeApi(nomeOuNumero);
    if (await this.repositorio.existe(treinadorId, pokemon.numero)) {
      throw new Conflito(`${pokemon.nome} já está no time de ${treinador.nome}`);
    }
    await this.repositorio.inserir(treinadorId, pokemon);
    return pokemon;
  }

  async remover(treinadorId: number, numero: number) {
    await this.treinadores.buscarPorId(treinadorId);
    if (!(await this.repositorio.remover(treinadorId, numero))) {
      throw new NaoEncontrado(`O Pokémon ${numero} não está no time do treinador ${treinadorId}`);
    }
  }

  // No corpo do POST, Pokémon que não existe é um dado errado do cliente: 400, e não 404
  private async buscarNaPokeApi(nomeOuNumero: string) {
    try {
      return await buscarPokemon(nomeOuNumero);
    } catch (erro) {
      if (erro instanceof NaoEncontrado) throw new RegraDeNegocio(erro.message);
      throw erro;
    }
  }
}
