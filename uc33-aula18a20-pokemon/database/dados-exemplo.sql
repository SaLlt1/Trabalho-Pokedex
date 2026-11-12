-- Times de exemplo, com dados copiados da PokéAPI. Rode DEPOIS do schema.sql (Aula 18 em diante).
USE pokemon_uc33;
SET NAMES utf8mb4;

INSERT INTO time_pokemon (treinador_id, numero, nome, tipos, imagem) VALUES
  (1, 25, 'pikachu',    'electric',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'),
  (1, 1,  'bulbasaur',  'grass,poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'),
  (2, 4,  'charmander', 'fire',         'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png');
