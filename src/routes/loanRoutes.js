import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

router.get('/', LoanController.getLoans);
router.get('/top-borrowers', LoanController.getTopBorrowers); // Rute spesifik
router.get('/:id', LoanController.getLoanById);
router.post('/', LoanController.createLoan);
router.put('/:id', LoanController.updateLoan);
router.delete('/:id', LoanController.deleteLoan);

export default router;