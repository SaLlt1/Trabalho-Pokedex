import { Router } from 'express';
import { TreinadorController } from '../controllers/TreinadorController.js';
import { TimeController } from '../controllers/TimeController.js';
import { validarCorpo } from '../middlewares/validarCorpo.js';

const treinadores = new TreinadorController();
const time = new TimeController();
export const treinadorRoutes = Router();

treinadorRoutes.get('/', treinadores.listar);
treinadorRoutes.post('/', validarCorpo('DadosTreinador'), treinadores.criar);
treinadorRoutes.get('/:id', treinadores.buscarPorId);
treinadorRoutes.put('/:id', validarCorpo('DadosTreinador'), treinadores.atualizar);
treinadorRoutes.delete('/:id', treinadores.remover);

// O time é um recurso dentro do treinador
treinadorRoutes.get('/:id/time', time.listar);
treinadorRoutes.post('/:id/time', validarCorpo('DadosNoTime'), time.adicionar);
treinadorRoutes.delete('/:id/time/:numero', time.remover);
