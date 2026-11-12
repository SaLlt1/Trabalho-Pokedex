export class NaoEncontrado extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'NaoEncontrado';
  }
}
