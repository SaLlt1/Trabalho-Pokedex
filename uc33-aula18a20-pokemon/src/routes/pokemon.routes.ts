import { Router } from 'express';
import { PokemonController } from '../controllers/PokemonController.js';

const controller = new PokemonController();
export const pokemonRoutes = Router();

// :nome aceita o nome (pikachu) ou o número (25)
pokemonRoutes.get('/:nome', controller.buscar);
