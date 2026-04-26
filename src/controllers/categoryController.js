export const CategoryController = {
  
  async getCategories(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async addCategory(req, res) {
    try {
      if (!req.body.name) return res.status(400).json({ error: 'Nama kategori harus diisi' });
      const category = await CategoryModel.create(req.body.name);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async updateCategory(req, res) {
    try {
      const updated = await CategoryModel.update(req.params.id, req.body.name);
      if (!updated) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async deleteCategory(req, res) {
    try {
      const deleted = await CategoryModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      res.json({ message: 'Kategori berhasil dihapus' });
    } catch (err) {
      // Error ini biasanya muncul jika kategori masih dipakai oleh buku (FK Constraint)
      res.status(500).json({ error: "Gagal menghapus: Kategori mungkin masih digunakan oleh data buku." });
    }
  },

};