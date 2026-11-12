import type { Request, Response } from 'express';
import { buscarPokemon } from '../integracoes/pokeApi.js';

export class PokemonController {
  // Pokémon que não existe: 404 (aqui o recurso pedido é o próprio Pokémon)
  async buscar(req: Request, res: Response) {
    res.status(200).json(await buscarPokemon(String(req.params.nome)));
  }
}
