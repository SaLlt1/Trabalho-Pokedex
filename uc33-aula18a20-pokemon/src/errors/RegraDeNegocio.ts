export class RegraDeNegocio extends Error {
  // detalhes: lista opcional, usada quando há mais de um problema (ex.: corpo fora do contrato)
  constructor(mensagem: string, public detalhes?: string[]) {
    super(mensagem);
    this.name = 'RegraDeNegocio';
  }
}
