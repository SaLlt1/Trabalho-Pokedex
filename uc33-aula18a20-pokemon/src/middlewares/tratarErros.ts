import type { NextFunction, Request, Response } from 'express';
import { RegraDeNegocio } from '../errors/RegraDeNegocio.js';
import { NaoEncontrado } from '../errors/NaoEncontrado.js';
import { Conflito } from '../errors/Conflito.js';
import { ServicoIndisponivel } from '../errors/ServicoIndisponivel.js';

// O formato único de erro da API, igual ao esquema Erro do contrato:
// { "erro": "mensagem" }  ou  { "erro": "mensagem", "detalhes": ["...", "..."] }
interface CorpoDeErro {
  erro: string;
  detalhes?: string[];
}

interface RespostaDeErro {
  status: number;
  corpo: CorpoDeErro;
}

// Cada tipo de erro vira um status e um corpo. É o único lugar da API que decide isso.
function traduzir(erro: unknown): RespostaDeErro {
  if (erro instanceof RegraDeNegocio) {
    const corpo: CorpoDeErro = { erro: erro.message };
    if (erro.detalhes) corpo.detalhes = erro.detalhes;
    return { status: 400, corpo };
  }
  if (erro instanceof NaoEncontrado) return { status: 404, corpo: { erro: erro.message } };
  if (erro instanceof Conflito) return { status: 409, corpo: { erro: erro.message } };
  // A PokéAPI falhou ou demorou: o problema não é do cliente nem da nossa API
  if (erro instanceof ServicoIndisponivel) return { status: 503, corpo: { erro: erro.message } };

  // Erros que o próprio Express gera ao ler o corpo da requisição
  const tipo = (erro as { type?: string }).type;
  if (tipo === 'entity.parse.failed') {
    return { status: 400, corpo: { erro: 'O corpo não é um JSON válido' } };
  }
  if (tipo === 'entity.too.large') {
    return { status: 413, corpo: { erro: 'O corpo passou do tamanho máximo permitido (100 KB)' } };
  }

  return { status: 500, corpo: { erro: 'Erro interno no servidor' } };
}

// Middleware de erro: tem QUATRO parâmetros. É assim que o Express sabe que ele trata erros.
export function tratarErros(erro: unknown, _req: Request, res: Response, _next: NextFunction) {
  const { status, corpo } = traduzir(erro);
  if (status === 500) {
    console.error(erro); // o detalhe técnico fica no terminal, não vai para o cliente
  }
  res.status(status).json(corpo);
}
