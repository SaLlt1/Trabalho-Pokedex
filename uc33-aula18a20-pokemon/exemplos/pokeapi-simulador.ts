// SIMULADOR da PokéAPI, para testar sem internet. NÃO é o serviço real.
// Imita o formato de https://pokeapi.co/api/v2/pokemon/{nome ou número}, só com os campos que usamos.
// Os dados abaixo foram copiados da PokéAPI de verdade.
// Rode com: npm run pokeapi:simulador   e use no .env: POKEAPI_URL=http://localhost:3005
import express from 'express';

const app = express();
const PORTA = 3005;
const SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const POKEMONS = [
  { id: 1, name: 'bulbasaur', tipos: ['grass', 'poison'] },
  { id: 4, name: 'charmander', tipos: ['fire'] },
  { id: 7, name: 'squirtle', tipos: ['water'] },
  { id: 25, name: 'pikachu', tipos: ['electric'] },
  { id: 79, name: 'slowpoke', tipos: ['water', 'psychic'] },
].map((p) => ({
  id: p.id, name: p.name,
  types: p.tipos.map((t, i) => ({ slot: i + 1, type: { name: t, url: '' } })),
  sprites: { front_default: `${SPRITE}/${p.id}.png` },
}));

app.get('/api/v2/pokemon/:chave', async (req, res) => {
  const chave = req.params.chave.toLowerCase();
  console.log(`[simulador] GET /api/v2/pokemon/${chave}`);
  if (chave === 'slowpoke' || chave === '79') {
    await new Promise((r) => setTimeout(r, 10000)); // o Slowpoke é lento: 10 segundos
  }
  if (chave === 'missingno') {
    res.status(500).send('Internal Server Error'); // finge que o serviço quebrou
    return;
  }
  const achado = POKEMONS.find((p) => p.name === chave || String(p.id) === chave);
  if (!achado) {
    res.status(404).json({ status: 404, message: 'Not Found' }); // igual à PokéAPI real
    return;
  }
  res.json(achado);
});

app.listen(PORTA, () => {
  console.log(`Simulador da PokéAPI em http://localhost:${PORTA} (bulbasaur, charmander, squirtle, pikachu; slowpoke demora; missingno quebra)`);
});
