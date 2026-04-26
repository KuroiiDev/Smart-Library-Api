import { pool } from '../config/db.js';

export const AuthorModel = {

  async getAll(name = '') {
    const query = `
    SELECT * FROM authors 
    WHERE name ILIKE $1 
    ORDER BY name ASC
  `;
    const values = [`%${name}%` || '%%'];
    const result = await pool.query(query, values);
    return result.rows;
  },
  async getById(id) {
    const query = 'SELECT * FROM authors WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  async create(name, nationality) {
    const query = 'INSERT INTO authors (name, nationality) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [name, nationality]);
    return result.rows[0];
  },
  async update(id, { name, nationality }) {
    const query = `
      UPDATE authors 
      SET 
        name = COALESCE($1, name), 
        nationality = COALESCE($2, nationality) 
      WHERE id = $3 
      RETURNING *`;
    const result = await pool.query(query, [name, nationality, id]);
    return result.rows[0];
  },
  async delete(id) {
    const query = 'DELETE FROM authors WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  },

};