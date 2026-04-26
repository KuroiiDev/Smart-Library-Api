import { pool } from '../config/db.js';

export const GlobalModel = {

  async getLibraryStats() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM books) AS total_books,
        (SELECT COUNT(*) FROM authors) AS total_authors,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM loans WHERE status = 'BORROWED') AS active_loans
    `;
    const result = await pool.query(query);
    const stats = result.rows[0];
    return {
      total_books: parseInt(stats.total_books),
      total_authors: parseInt(stats.total_authors),
      total_categories: parseInt(stats.total_categories),
      active_loans: parseInt(stats.active_loans)
    };
  }
  
};