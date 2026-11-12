-- Banco das Aulas 18 a 20: treinadores e o time de Pokémon de cada um
CREATE DATABASE IF NOT EXISTS pokemon_uc33 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pokemon_uc33;
SET NAMES utf8mb4;

DROP TABLE IF EXISTS time_pokemon;
DROP TABLE IF EXISTS treinadores;

CREATE TABLE treinadores (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nome   VARCHAR(60) NOT NULL UNIQUE,
  cidade VARCHAR(60) NOT NULL
);

-- Só o que a nossa API precisa guardar. O resto dos dados fica na PokéAPI.
CREATE TABLE time_pokemon (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  treinador_id INT          NOT NULL,
  numero       INT          NOT NULL,           -- número na Pokédex (o "id" da PokéAPI)
  nome         VARCHAR(40)  NOT NULL,
  tipos        VARCHAR(60)  NOT NULL,           -- separados por vírgula: grass,poison
  imagem       VARCHAR(200) NULL,
  CONSTRAINT fk_time_treinador FOREIGN KEY (treinador_id) REFERENCES treinadores(id) ON DELETE CASCADE,
  CONSTRAINT uq_time UNIQUE (treinador_id, numero) -- o mesmo Pokémon não entra duas vezes no time
);

INSERT INTO treinadores (nome, cidade) VALUES ('Bia', 'Natal'), ('Caio', 'Mossoró'), ('Duda', 'Parnamirim');
