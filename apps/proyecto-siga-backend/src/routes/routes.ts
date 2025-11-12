import { Router } from "express";
import { UsersController, PublicUsersController } from "../controllers/usersController";
import { AuthController } from "../controllers/authController";
import { AssignmentController } from "../controllers/assignmentController";
import { AnswersController } from "../controllers/answerController";
export const router = Router();

// privates routes
router.use('/users',UsersController);
router.use('/auth',AuthController);
router.use('/assignments',AssignmentController);
router.use('/answers',AnswersController);
// public routes
router.use('/public/users', PublicUsersController);




