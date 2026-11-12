import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { rotasV1 } from './routes/v1.js';
import { rotaNaoEncontrada } from './middlewares/rotaNaoEncontrada.js';
import { tratarErros } from './middlewares/tratarErros.js';
import { contrato } from './contrato/openapi.js';
import { config } from './config.js';

export const app = express();

// CORS: diz ao navegador quais front-ends podem chamar a API.
app.use(cors({ origin: config.origens, exposedHeaders: ['Location'] }));
app.use(express.json());

// O contrato: em JSON para programas, em página para pessoas
app.get('/api/openapi.json', (_req, res) => res.json(contrato));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(contrato));

app.use('/api/v1', rotasV1);

// Sempre por último, nesta ordem: primeiro o 404 de rota, depois o tratamento de erros
app.use(rotaNaoEncontrada);
app.use(tratarErros);
