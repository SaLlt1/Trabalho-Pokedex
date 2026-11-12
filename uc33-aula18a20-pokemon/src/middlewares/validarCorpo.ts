import type { NextFunction, Request, Response } from 'express';
import type { ErrorObject } from 'ajv';
import { Ajv2020 } from 'ajv/dist/2020.js';
import * as esquemas from '../contrato/esquemas.js';
import { RegraDeNegocio } from '../errors/RegraDeNegocio.js';

const ajv = new Ajv2020({ allErrors: true });
ajv.addKeyword('example'); // usado só pela documentação

const TIPOS: Record<string, string> = { string: 'texto', integer: 'inteiro', object: 'objeto' };

// Transforma o erro do Ajv em uma frase para quem consome a API
function traduzir(e: ErrorObject): string {
  const campo = e.instancePath.slice(1) || 'corpo';
  switch (e.keyword) {
    case 'required': return `falta o campo ${e.params.missingProperty}`;
    case 'additionalProperties': return `o campo ${e.params.additionalProperty} não faz parte do contrato`;
    case 'type': return `${campo} deve ser ${TIPOS[e.params.type] ?? e.params.type}`;
    case 'minLength': return `${campo} deve ter pelo menos ${e.params.limit} caracteres`;
    case 'maxLength': return `${campo} deve ter no máximo ${e.params.limit} caracteres`;
    case 'minimum': return `${campo} deve ser no mínimo ${e.params.limit}`;
    case 'pattern': return `${campo} não está no formato esperado`;
    default: return `${campo}: ${e.message}`;
  }
}

// Middleware: confere o corpo contra um esquema do contrato
export function validarCorpo(nome: keyof typeof esquemas) {
  const validar = ajv.compile(esquemas[nome]);
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.is('application/json')) {
      next(new RegraDeNegocio('Envie o corpo em JSON (Content-Type: application/json)'));
      return;
    }
    if (!validar(req.body)) {
      next(new RegraDeNegocio('O corpo não segue o contrato', (validar.errors ?? []).map(traduzir)));
      return;
    }
    next();
  };
}
