// Aula 18 · Experimento: chamar a PokéAPI direto, sem a nossa API no meio.
// Rode com: npm run pokeapi:direto           ou   npm run pokeapi:direto -- charmander
const nome = process.argv[2] ?? 'pikachu';
const url = `https://pokeapi.co/api/v2/pokemon/${nome}`;

const inicio = Date.now();
const resposta = await fetch(url, { signal: AbortSignal.timeout(5000) });
const texto = await resposta.text();
console.log(`GET ${url}`);
console.log(`status ${resposta.status} em ${Date.now() - inicio} ms · ${(texto.length / 1024).toFixed(0)} KB`);

if (resposta.ok) {
  const dados = JSON.parse(texto);
  console.log('campos no primeiro nível:', Object.keys(dados).length);
  console.log('o que vamos usar:', {
    id: dados.id,
    name: dados.name,
    types: dados.types.map((t: { type: { name: string } }) => t.type.name),
    imagem: dados.sprites.front_default,
  });
} else {
  console.log('corpo:', texto);
}
