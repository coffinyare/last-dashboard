import express from 'express';
import {
    createContractor,
    getAllContractors,
    getContractorById,
    updateContractor,
    deleteContractor
} from '../controller/Contractor.js';

const router = express.Router();

// Routes for contractors
router.post('/contractors', createContractor);     
router.get('/contractors', getAllContractors);       
router.get('/contractors/:id', getContractorById);   
router.put('/contractors/:id', updateContractor);    
router.delete('/contractors/:id', deleteContractor); 

export default router;
