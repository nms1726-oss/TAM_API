import { Router } from "express";
import user from '../../controllers/users';
import { upload } from '../../middlewares/upload';

const router = Router();

router.route("/all").get(user.getAllUsers);
router.get("/check-username", user.checkUsername);
router.get("/:id", user.getUserById);
router.post("/create", user.createUser);
router.put("/update/:id", user.updateUser);
router.delete("/delete/:id", user.deleteUser);
router.put("/upload-photo/:id", upload.single('foto'), user.uploadProfilePhoto);

export default router;