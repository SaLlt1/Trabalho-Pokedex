import { Router } from 'express';
import { treinadorRoutes } from './treinador.routes.js';
import { pokemonRoutes } from './pokemon.routes.js';

// Versão 1 da API: todos os recursos debaixo de um só prefixo
export const rotasV1 = Router();

rotasV1.use('/treinadores', treinadorRoutes);
rotasV1.use('/pokemons', pokemonRoutes);
