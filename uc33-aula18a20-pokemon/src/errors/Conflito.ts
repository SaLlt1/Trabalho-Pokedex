export class Conflito extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'Conflito';
  }
}
