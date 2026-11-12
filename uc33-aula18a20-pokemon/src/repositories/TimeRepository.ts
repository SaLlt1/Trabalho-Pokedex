import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/conexao.js';
import type { Pokemon } from '../entities/Pokemon.js';

// Os tipos ficam numa coluna só, separados por vírgula: "grass,poison" vira ["grass", "poison"]
const paraPokemon = (l: RowDataPacket): Pokemon =>
  ({ numero: l.numero, nome: l.nome, tipos: l.tipos.split(','), imagem: l.imagem });

export class TimeRepository {
  async listar(treinadorId: number): Promise<Pokemon[]> {
    const [linhas] = await pool.query<RowDataPacket[]>(
      'SELECT numero, nome, tipos, imagem FROM time_pokemon WHERE treinador_id = ? ORDER BY id', [treinadorId]);
    return linhas.map(paraPokemon);
  }

  async contar(treinadorId: number): Promise<number> {
    const [linhas] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM time_pokemon WHERE treinador_id = ?', [treinadorId]);
    return Number(linhas[0].total);
  }

  async existe(treinadorId: number, numero: number): Promise<boolean> {
    const [linhas] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM time_pokemon WHERE treinador_id = ? AND numero = ?', [treinadorId, numero]);
    return linhas.length > 0;
  }

  async inserir(treinadorId: number, p: Pokemon): Promise<void> {
    await pool.query(
      'INSERT INTO time_pokemon (treinador_id, numero, nome, tipos, imagem) VALUES (?, ?, ?, ?, ?)',
      [treinadorId, p.numero, p.nome, p.tipos.join(','), p.imagem]);
  }

  async remover(treinadorId: number, numero: number): Promise<boolean> {
    const [r] = await pool.query<ResultSetHeader>(
      'DELETE FROM time_pokemon WHERE treinador_id = ? AND numero = ?', [treinadorId, numero]);
    return r.affectedRows > 0;
  }
}
