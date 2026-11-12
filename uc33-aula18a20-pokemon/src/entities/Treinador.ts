import type { Pokemon } from './Pokemon.js';

// Na lista: só o total do time. No detalhe: o time inteiro.
export interface Treinador {
  id: number;
  nome: string;
  cidade: string;
  totalPokemon: number;
}

export interface TreinadorComTime extends Omit<Treinador, 'totalPokemon'> {
  time: Pokemon[];
}
