import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {

  async getAuthors(req, res) {
    try {
      const authors = await AuthorModel.getAll();
      res.json(authors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getAuthorById(req, res) {
    try {
      const { id } = req.params;
      const author = await AuthorModel.getById(id);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async updateAuthor(req, res) {
    try {
      const { id } = req.params;
      const { name, nationality } = req.body;
      
      if (!name && !nationality) {
        return res.status(400).json({ error: 'At least name or nationality is required to update' });
      }

      const updatedAuthor = await AuthorModel.update(id, { name, nationality });
      
      if (!updatedAuthor) {
        return res.status(404).json({ error: 'Author not found or no changes made' });
      }

      res.json({ message: 'Author updated successfully', data: updatedAuthor });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async deleteAuthor(req, res) {
    try {
      const { id } = req.params;
      const success = await AuthorModel.delete(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Author not found' });
      }

      res.json({ message: 'Author deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

};