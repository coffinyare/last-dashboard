import express from 'express';
import {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  declineTenantLease,
  endTenantLease,
  deleteTenant,
  getAllnonDeclined
} from '../controller/Tenants.js';

const router = express.Router();

// Create a new tenant
router.post('/tenants', createTenant);

// Get all tenants
router.get('/tenants', getAllTenants);

router.get('/getAllnonDeclined', getAllnonDeclined);

// Get a tenant by ID
router.get('/tenants/:id', getTenantById);

// Update tenant by ID
router.put('/tenants/:id', updateTenant);

// Decline a tenant lease (sets leaseStatus to 'Declined' and updates endDate)
router.patch('/tenants/:id/decline', declineTenantLease);

// End a tenant lease (sets leaseStatus to 'Ended' and updates endDate)
router.patch('/tenants/:id/end', endTenantLease);

// Delete tenant by ID
router.delete('/tenants/:id', deleteTenant);

export default router;
