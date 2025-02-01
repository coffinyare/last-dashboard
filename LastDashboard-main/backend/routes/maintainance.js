import express from 'express';
import {
    createMaintenanceRequest,
    assignContractorToRequest,
    updateMaintenanceRequest,
    getAllMaintenanceRequests,
    deleteMaintenanceRequest, 
    getMaintenanceRequestById
} from '../controller/maintainance.js';

const router = express.Router();


// Routes for maintenance requests
router.post('/maintenance', createMaintenanceRequest);              
router.put('/maintenance/:id/assign',  assignContractorToRequest); 
router.put('/maintenance/:id',  updateMaintenanceRequest); 
router.get('/maintenance',  getAllMaintenanceRequests); 
router.delete('/maintenance/:id', deleteMaintenanceRequest);
router.get('/maintenance/:id', getMaintenanceRequestById);


export default router;
