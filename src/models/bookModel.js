import pool from '../config/db.js';

export const BookModel = {
  
  async getAll() {
    const query = `
      SELECT b.*, a.name as author_name, c.name as category_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.title ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getById(id) {
    const query = `
      SELECT b.*, a.name as author_name, c.name as category_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async create(data) {
    const { isbn, title, author_id, category_id, total_copies } = data;
    const query = `
      INSERT INTO books (isbn, title, author_id, category_id, total_copies, available_copies)
      VALUES ($1, $2, $3, $4, $5, $5) RETURNING *
    `;
    const result = await pool.query(query, [isbn, title, author_id, category_id, total_copies]);
    return result.rows[0];
  },

  async update(id, data) {
    const { isbn, title, author_id, category_id, total_copies, available_copies } = data;
    const query = `
      UPDATE books 
      SET 
        isbn = COALESCE($1, isbn),
        title = COALESCE($2, title),
        author_id = COALESCE($3, author_id),
        category_id = COALESCE($4, category_id),
        total_copies = COALESCE($5, total_copies),
        available_copies = COALESCE($6, available_copies)
      WHERE id = $7 RETURNING *
    `;
    const result = await pool.query(query, [isbn, title, author_id, category_id, total_copies, available_copies, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM books WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) throw new Error("Buku tidak ditemukan");
    return { message: "Buku berhasil dihapus dari sistem." };
  },

};