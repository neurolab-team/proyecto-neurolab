import { Router } from "express";
import { UsersController, PublicUsersController } from "../controllers/usersController";
import { AuthController } from "../controllers/authController";
import { AssignmentController } from "../controllers/assignmentController";
import { AnswersController } from "../controllers/answerController";
import { AssignmentScoreController } from "../controllers/assignmentScoreController";
import { PublicTestController } from "../controllers/publicTestController";
import { HealthController } from "../controllers/healthController";
export const router = Router();

// health (sin auth, sin rate limit: lo consume el pipeline, el HEALTHCHECK y el proxy)
router.use('/health', HealthController);

// privates routes
router.use('/users',UsersController);
router.use('/auth',AuthController);
router.use('/assignments',AssignmentController);
router.use('/answers',AnswersController);
router.use('/assignmentScores',AssignmentScoreController);
// public routes
router.use('/public/users', PublicUsersController);
router.use('/public/tests', PublicTestController);




