import { TreinadorRepository } from '../repositories/TreinadorRepository.js';
import { TimeRepository } from '../repositories/TimeRepository.js';
import type { DadosTreinador } from '../entities/DadosTreinador.js';
import type { TreinadorComTime } from '../entities/Treinador.js';
import { NaoEncontrado } from '../errors/NaoEncontrado.js';
import { Conflito } from '../errors/Conflito.js';

export class TreinadorService {
  constructor(
    private repositorio = new TreinadorRepository(),
    private time = new TimeRepository(),
  ) {}

  listar() {
    return this.repositorio.listar();
  }

  async buscarPorId(id: number) {
    const treinador = await this.repositorio.buscarPorId(id);
    if (!treinador) throw new NaoEncontrado(`Treinador ${id} não encontrado`);
    return treinador;
  }

  // O detalhe traz o time inteiro, no lugar do total
  async buscarComTime(id: number): Promise<TreinadorComTime> {
    const { totalPokemon: _total, ...treinador } = await this.buscarPorId(id);
    return { ...treinador, time: await this.time.listar(id) };
  }

  async criar(dados: DadosTreinador) {
    await this.garantirNomeLivre(dados.nome);
    return this.buscarPorId(await this.repositorio.inserir(dados));
  }

  async atualizar(id: number, dados: DadosTreinador) {
    await this.buscarPorId(id);
    await this.garantirNomeLivre(dados.nome, id);
    await this.repositorio.atualizar(id, dados);
    return this.buscarPorId(id);
  }

  async remover(id: number) {
    if (!(await this.repositorio.remover(id))) throw new NaoEncontrado(`Treinador ${id} não encontrado`);
  }

  private async garantirNomeLivre(nome: string, idAtual = 0) {
    if (await this.repositorio.existeNome(nome, idAtual)) {
      throw new Conflito(`Já existe um treinador chamado ${nome}`);
    }
  }
}
