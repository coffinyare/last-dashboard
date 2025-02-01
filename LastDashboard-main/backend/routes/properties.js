import express from 'express'

import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    uploadImage,
    getRentedProperties,
  } from '../controller/properties.js';
const router = express.Router();


router.get('/properties', getProperties);
router.get('/nonrentedProperties',getRentedProperties)
router.get('/property/:id', getPropertyById);
router.put('/property/:id', updateProperty);
router.delete('/property/:id', deleteProperty);
router.post('/property',createProperty)

router.post('/upload', uploadImage);
export default router;