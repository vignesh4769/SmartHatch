import express from 'express';
import { getMess } from '../controllers/messController.js';
const employeeRoutes = express.Router();

employeeRoutes.get('/', getMess);
employeeRoutes.get('/test', (req, res) => {
    res.send('Test route working');
  });
  
export default employeeRoutes;
