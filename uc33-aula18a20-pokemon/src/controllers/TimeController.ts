import type { Request, Response } from 'express';
import { TimeService } from '../services/TimeService.js';
import { lerId } from './lerId.js';
import { RegraDeNegocio } from '../errors/RegraDeNegocio.js';

const service = new TimeService();

function lerNumero(req: Request): number {
  const numero = Number(req.params.numero);
  if (!Number.isInteger(numero) || numero < 1) {
    throw new RegraDeNegocio(`O número do Pokémon deve ser um inteiro a partir de 1 (recebido: ${req.params.numero})`);
  }
  return numero;
}

export class TimeController {
  async listar(req: Request, res: Response) {
    res.status(200).json(await service.listar(lerId(req)));
  }

  async adicionar(req: Request, res: Response) {
    const id = lerId(req);
    const pokemon = await service.adicionar(id, req.body.pokemon);
    res.status(201).location(`/api/v1/treinadores/${id}/time/${pokemon.numero}`).json(pokemon);
  }

  async remover(req: Request, res: Response) {
    await service.remover(lerId(req), lerNumero(req));
    res.status(204).end();
  }
}
