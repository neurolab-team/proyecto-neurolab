import { Router } from "express";
import { UsersController, PublicUsersController } from "../controllers/usersController";
import { AuthController } from "../controllers/authController";
export const router = Router();

// privates routes
router.use('/users',UsersController);
router.use('/auth',AuthController);
<<<<<<< HEAD
=======

// public routes
router.use('/public/users', PublicUsersController)



>>>>>>> remotes/origin/jhonzabala/refactoringWeb

// public routes
router.use('/public/users', PublicUsersController)