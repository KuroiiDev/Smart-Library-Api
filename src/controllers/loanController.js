import { LoanModel } from '../models/loanModel.js';

export const LoanController = {

  async createLoan(req, res) {
    const { book_id, member_id, due_date } = req.body;
    try {
      const loan = await LoanModel.createLoan(book_id, member_id, due_date);
      res.status(201).json({
        message: "Peminjaman berhasil dicatat!",
        data: loan
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async getLoans(req, res) {
    try {
      const loans = await LoanModel.getAllLoans();
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getTopBorrowers(req, res) {
    try {
      const topBorrowers = await LoanModel.getTopBorrowers();
      res.json({
        message: "Top 3 peminjam buku berhasil diambil",
        data: topBorrowers
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getLoanById(req, res) {
    try {
      const loan = await LoanModel.getLoanById(req.params.id);
      if (!loan) return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
      res.json(loan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async updateLoan(req, res) {
    try {
      const { id } = req.params;
      const { due_date, status } = req.body; // Contoh data yang bisa diedit

      if (!due_date && !status) {
        return res.status(400).json({ error: 'Data yang akan diubah tidak boleh kosong' });
      }

      const updatedLoan = await LoanModel.updateLoan(id, { due_date, status });

      if (!updatedLoan) {
        return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
      }

      res.json({
        message: "Data peminjaman berhasil diperbarui!",
        data: updatedLoan
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async deleteLoan(req, res) {
    try {
      const success = await LoanModel.deleteLoan(req.params.id);
      if (!success) return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
      res.json({ message: "Catatan peminjaman berhasil dihapus." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

};
