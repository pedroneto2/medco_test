import { Router } from 'express';
import { AuthController } from './src/controllers/authController';

const publicRouter = Router();
const authController = new AuthController();

// Health check
publicRouter.get('/', (req, res) => authController.healthCheck(req, res));

// Authentication routes
publicRouter.post('/register', (req, res) => authController.register(req, res));
publicRouter.post('/login', (req, res) => authController.login(req, res));
publicRouter.post('/logout', (req, res) => authController.logout(req, res));

export default publicRouter;