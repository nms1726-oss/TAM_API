import { Router } from "express";
import auth from '../../controllers/auth';

const router = Router();

router.post("/login", auth.login);
router.post("/register", auth.register);
router.put("/change-password/:id", auth.changePassword);
router.post("/send-code", auth.enviarCodigoVerificacion);
router.post("/verify-code", auth.verificarCodigo);

export default router;