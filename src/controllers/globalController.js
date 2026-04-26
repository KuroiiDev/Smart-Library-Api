import { GlobalModel } from '../models/globalModel.js';

export const GlobalController = {

  async getStats(req, res) {
    try {
      const stats = await GlobalModel.getLibraryStats();
      res.json({
        message: "Statistik Perpustakaan",
        data: stats
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};