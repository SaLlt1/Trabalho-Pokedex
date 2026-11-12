import type { Request, Response } from 'express';
import { TreinadorService } from '../services/TreinadorService.js';
import { lerId } from './lerId.js';

const service = new TreinadorService();

// Sem try/catch: os erros seguem para o middleware tratarErros
export class TreinadorController {
  async listar(_req: Request, res: Response) {
    res.status(200).json(await service.listar());
  }

  async buscarPorId(req: Request, res: Response) {
    res.status(200).json(await service.buscarComTime(lerId(req)));
  }

  async criar(req: Request, res: Response) {
    const novo = await service.criar(req.body);
    res.status(201).location(`/api/v1/treinadores/${novo.id}`).json(novo);
  }

  async atualizar(req: Request, res: Response) {
    res.status(200).json(await service.atualizar(lerId(req), req.body));
  }

  async remover(req: Request, res: Response) {
    await service.remover(lerId(req));
    res.status(204).end();
  }
}
