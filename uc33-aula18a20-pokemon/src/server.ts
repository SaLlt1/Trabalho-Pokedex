import { app } from './app.js';
import { config } from './config.js';

app.listen(config.porta, config.host, () => {
  console.log(`API rodando em http://${config.host}:${config.porta}`);
  console.log(`CORS liberado para: ${config.origens.join(', ') || '(nenhuma origem)'}`);
});
