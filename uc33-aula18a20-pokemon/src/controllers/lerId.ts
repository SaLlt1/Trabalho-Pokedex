import type { Request } from 'express';
import { RegraDeNegocio } from '../errors/RegraDeNegocio.js';

// O id chega da URL como texto. Só seguem números inteiros a partir de 1.
export function lerId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw new RegraDeNegocio(`O id deve ser um número inteiro a partir de 1 (recebido: ${req.params.id})`);
  }
  return id;
}
