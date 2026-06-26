
import express from 'express';
import { predictAdmission } from "../controller/admissionagent.controller.js";

const router = express.Router();

router.post('/predict', predictAdmission);

export default router;