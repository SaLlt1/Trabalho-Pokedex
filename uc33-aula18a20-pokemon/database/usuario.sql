-- Usuário com privilégio mínimo (só o que a API precisa). O mesmo usuário das outras aulas.
CREATE USER IF NOT EXISTS 'uc33_app'@'localhost' IDENTIFIED BY 'troque_esta_senha';
GRANT SELECT, INSERT, UPDATE, DELETE ON pokemon_uc33.* TO 'uc33_app'@'localhost';
FLUSH PRIVILEGES;
