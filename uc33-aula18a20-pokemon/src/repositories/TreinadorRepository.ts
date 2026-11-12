import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/conexao.js';
import type { Treinador } from '../entities/Treinador.js';
import type { DadosTreinador } from '../entities/DadosTreinador.js';

// O total do time vem junto, contado pelo banco
const SELECT_BASE = `
  SELECT t.id, t.nome, t.cidade, COUNT(p.id) AS totalPokemon
    FROM treinadores t
    LEFT JOIN time_pokemon p ON p.treinador_id = t.id`;

const paraEntidade = (l: RowDataPacket): Treinador =>
  ({ id: l.id, nome: l.nome, cidade: l.cidade, totalPokemon: Number(l.totalPokemon) });

export class TreinadorRepository {
  async listar(): Promise<Treinador[]> {
    const [linhas] = await pool.query<RowDataPacket[]>(`${SELECT_BASE} GROUP BY t.id ORDER BY t.id`);
    return linhas.map(paraEntidade);
  }

  async buscarPorId(id: number): Promise<Treinador | null> {
    const [linhas] = await pool.query<RowDataPacket[]>(`${SELECT_BASE} WHERE t.id = ? GROUP BY t.id`, [id]);
    return linhas.length ? paraEntidade(linhas[0]) : null;
  }

  async existeNome(nome: string, ignorarId = 0): Promise<boolean> {
    const [linhas] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM treinadores WHERE nome = ? AND id <> ?', [nome, ignorarId]);
    return linhas.length > 0;
  }

  async inserir(dados: DadosTreinador): Promise<number> {
    const [r] = await pool.query<ResultSetHeader>(
      'INSERT INTO treinadores (nome, cidade) VALUES (?, ?)', [dados.nome, dados.cidade]);
    return r.insertId;
  }

  async atualizar(id: number, dados: DadosTreinador): Promise<void> {
    await pool.query('UPDATE treinadores SET nome = ?, cidade = ? WHERE id = ?', [dados.nome, dados.cidade, id]);
  }

  // O time vai junto: ON DELETE CASCADE no banco
  async remover(id: number): Promise<boolean> {
    const [r] = await pool.query<ResultSetHeader>('DELETE FROM treinadores WHERE id = ?', [id]);
    return r.affectedRows > 0;
  }
}
