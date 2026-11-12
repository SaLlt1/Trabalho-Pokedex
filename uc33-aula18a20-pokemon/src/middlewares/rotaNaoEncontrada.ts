import type { NextFunction, Request, Response } from 'express';
import { NaoEncontrado } from '../errors/NaoEncontrado.js';

// Fica depois de todas as rotas: se a requisição chegou aqui, nenhuma rota atendeu
export function rotaNaoEncontrada(req: Request, _res: Response, next: NextFunction) {
  next(new NaoEncontrado(`A rota ${req.method} ${req.originalUrl} não existe`));
}
