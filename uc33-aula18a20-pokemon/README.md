# UC33 · Aulas 18 a 20 — API de Treinadores Pokémon

Prof. Alex Almeida · Desenvolver serviços web · SENAC RN

Um projeto **separado** do de funcionários. Cada treinador monta um time de até 6 Pokémon.
A nossa API guarda só o essencial e busca os dados de cada Pokémon na [PokéAPI](https://pokeapi.co/docs/v2),
um serviço público, gratuito e sem cadastro.

- **Aula 18** · consumir um serviço de terceiros no back-end: `src/integracoes/pokeApi.ts` e o recurso `time`.
- **Aula 19** · front-end que consome e manipula registros: a pasta `front/`.
- **Aula 20** · prática de integração: o roteiro impresso testa tudo de ponta a ponta.

O ponto de partida da Aula 18 é o `uc33-aula18-pokemon-inicio.zip`: o CRUD de treinadores pronto, sem a PokéAPI.

## Rotas (contrato em http://localhost:3000/api/docs)

| Método e caminho | O que faz |
|---|---|
| `GET /api/v1/treinadores` | Lista, com o total do time de cada um |
| `POST /api/v1/treinadores` | Cadastra (`{ "nome", "cidade" }`) |
| `GET /api/v1/treinadores/{id}` | Um treinador, com o time inteiro |
| `PUT /api/v1/treinadores/{id}` | Altera nome e cidade |
| `DELETE /api/v1/treinadores/{id}` | Apaga o treinador e o time dele |
| `GET /api/v1/treinadores/{id}/time` | Os Pokémon do time |
| `POST /api/v1/treinadores/{id}/time` | Põe um Pokémon no time (`{ "pokemon": "pikachu" }` ou `"25"`) |
| `DELETE /api/v1/treinadores/{id}/time/{numero}` | Tira um Pokémon do time |
| `GET /api/v1/pokemons/{nome}` | Consulta um Pokémon na PokéAPI (nome ou número) |

## O que acontece em cada caso (testado de verdade)

| Situação | Resposta |
|---|---|
| Pokémon existe (`pikachu`, `Pikachu` ou `25`) | 200 / 201 com número, nome, tipos e imagem |
| Texto impossível (`pika chu`) | 400, sem chamar a PokéAPI |
| Pokémon que não existe | 404 em `/pokemons`; **400** no `POST /time` (é um dado errado no corpo) |
| Treinador que não existe | 404, **antes** de chamar a PokéAPI |
| Pokémon repetido no time | 409 |
| Time com 6 | 409 |
| PokéAPI fora do ar, sem internet, erro dela ou mais de 3 s | 503 (nada é gravado) |

A primeira busca do Pikachu levou 0,46 s; a segunda, pelo número, 0,001 s: veio da memória da API.
A resposta da PokéAPI para o Pikachu tem **302 KB**; a nossa devolve só 4 campos.

## Preparação

```bash
npm install
mysql -u root -p < database/schema.sql          # banco pokemon_uc33, com 3 treinadores
mysql -u root -p < database/usuario.sql
mysql -u root -p < database/dados-exemplo.sql   # times de exemplo
cp .env.example .env                            # no Windows (cmd): copy .env.example .env
npm run dev
```

O front-end: no VS Code, abra `front/index.html` e clique em **Go Live** (extensão Live Server, porta 5500).

### Sem internet: o simulador

```bash
npm run pokeapi:simulador         # em outro terminal: porta 3005
# no .env: POKEAPI_URL=http://localhost:3005   (e reinicie a API)
```

O simulador **não é a PokéAPI**: imita o formato dela, com dados copiados do serviço real. Conhece
bulbasaur (1), charmander (4), squirtle (7) e pikachu (25). O **slowpoke** (79) demora 10 s e o **missingno**
quebra (500). Os outros respondem 404, como a PokéAPI.

### Experimento da Aula 18: a PokéAPI direto

```bash
npm run pokeapi:direto                 # pikachu
npm run pokeapi:direto -- naoexiste    # 404
```

### Laboratório com proxy

Se a internet do laboratório passa por um proxy, o `fetch` do Node não usa o proxy sozinho. No Node 22.21 ou mais
novo, suba a API com a variável `NODE_USE_ENV_PROXY=1` (e o `HTTPS_PROXY` configurado). Foi assim que os testes
deste material chegaram à PokéAPI real.

## Regras de uso da PokéAPI

A política de uso justo pede para **guardar localmente** o que for buscado e avisa que quem abusar pode ter o IP
bloqueado de vez. Não exige cadastro nem chave. Por isso a API confere o texto antes de chamar, só chama depois
das regras do banco (treinador existe, time não está cheio) e guarda cada Pokémon na memória.

## Testes feitos neste material

API com `curl` contra a PokéAPI real e contra o simulador (todos os casos da tabela). Front-end no Chromium
(Playwright): lista, time da Bia, prévia do Gengar, adicionar, repetido (409), inexistente (400), tirar, erro de
contrato com detalhes, nome repetido (409), cadastrar, editar e excluir treinador, time vazio, nome com
`<img onerror=alert(1)>` (aparece como texto, o alerta não roda), carregando, API desligada e PokéAPI fora (503).
O Live Server não foi usado nos testes: a página foi servida por outro servidor estático, na porta 5500.

## Versões (fixadas no package.json)

Node 22 · express 5.2.1 · mysql2 3.23.2 · dotenv 17.2.3 · ajv 8.20.0 · cors 2.8.6 · swagger-ui-express 5.0.1 ·
swagger-ui-dist 5.33.0 · typescript 5.9.3 · tsx 4.23.1. Nenhuma biblioteca nova: o `fetch` já vem no Node 22.
Testado com MariaDB 10.11.
