// Um serviço de que dependemos (a PokéAPI) falhou ou não respondeu a tempo
export class ServicoIndisponivel extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'ServicoIndisponivel';
  }
}
