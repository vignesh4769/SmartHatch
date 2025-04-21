// routes/VisitorRoutes.js

import express from 'express';
import { registerVisitor, getAllVisitors, checkOutVisitor } from '../controllers/visitorController.js';

const VistorRouter = express.Router();

VistorRouter.post('/admin/addvisitors', registerVisitor);
VistorRouter.get('/admin/visitors', getAllVisitors);
VistorRouter.put('/admin/visitors/:id/checkout', checkOutVisitor);

export default VistorRouter;
