import express from 'express';
import { registerUser, loginUser, allUsers } from '../controller/User.js'; 

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/AllUsers',allUsers)

export default router;
20