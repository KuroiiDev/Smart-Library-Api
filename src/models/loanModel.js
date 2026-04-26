import { pool } from '../config/db.js';

export const LoanModel = {

  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }

      await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);

      const loanQuery = `
        INSERT INTO loans (book_id, member_id, due_date) 
        VALUES ($1, $2, $3) RETURNING *
      `;
      const result = await client.query(loanQuery, [book_id, member_id, due_date]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  async getAllLoans() {
    const query = `
      SELECT l.*, b.title as book_title, m.full_name as member_name 
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
    `;
    const result = await pool.query(query);
    return result.rows;
  },
  async getTopBorrowers() {
    const query = `
      SELECT
        m.id AS member_id,
        m.full_name,
        m.email,
        m.member_type,
        COUNT(l.id) AS total_loans,
        MAX(l.loan_date) AS last_loan_date,
        fav.title AS favorite_book_title,
        fav.times_borrowed
      FROM members m
      JOIN loans l ON l.member_id = m.id
      LEFT JOIN LATERAL (
        SELECT b.title, COUNT(*) AS times_borrowed
        FROM loans lx
        JOIN books b ON lx.book_id = b.id
        WHERE lx.member_id = m.id
        GROUP BY b.title
        ORDER BY times_borrowed DESC
        LIMIT 1
      ) fav ON true
      GROUP BY m.id, m.full_name, m.email, m.member_type, fav.title, fav.times_borrowed
      ORDER BY total_loans DESC
      LIMIT 3
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      member_id: row.member_id,
      full_name: row.full_name,
      email: row.email,
      member_type: row.member_type,
      "total loans": Number(row.total_loans),
      last_loan_date: row.last_loan_date ? row.last_loan_date.toISOString().split('T')[0] : null,
      favorite_book: {
        title: row.favorite_book_title || null,
        "times borrowed": row.times_borrowed ? Number(row.times_borrowed) : 0
      }
    }));
  },
  async getLoanById(id) {
    const query = `
      SELECT l.*, b.title as book_title, m.full_name as member_name 
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      WHERE l.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  async updateLoan(id, data) {
    const { due_date, status } = data;
    const query = `
      UPDATE loans 
      SET 
        due_date = COALESCE($1, due_date),
        status = COALESCE($2, status)
      WHERE id = $3 
      RETURNING *
    `;
    const result = await pool.query(query, [due_date, status, id]);
    return result.rows[0];
  },
  async deleteLoan(id) {
    const query = 'DELETE FROM loans WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  },
  async returnBook(loanId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const loanCheck = await client.query(
        'SELECT book_id, status FROM loans WHERE id = $1',
        [loanId]
      );

      if (loanCheck.rowCount === 0) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }

      if (loanCheck.rows[0].status === 'RETURNED') {
        throw new Error('Buku ini sudah dikembalikan sebelumnya.');
      }

      const bookId = loanCheck.rows[0].book_id;

      const updateLoanQuery = `
      UPDATE loans 
      SET status = 'RETURNED', return_date = NOW() 
      WHERE id = $1 
      RETURNING *
    `;
      const loanResult = await client.query(updateLoanQuery, [loanId]);
      await client.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
        [bookId]
      );

      await client.query('COMMIT');
      return loanResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

};
