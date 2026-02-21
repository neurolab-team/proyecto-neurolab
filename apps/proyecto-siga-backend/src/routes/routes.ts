import { Router } from "express";
import { UsersController, PublicUsersController } from "../controllers/usersController";
import { AuthController } from "../controllers/authController";
import { AssignmentController } from "../controllers/assignmentController";
import { AnswersController } from "../controllers/answerController";
import { AssignmentScoreController } from "../controllers/assignmentScoreController";
import { logger } from "../utils/logger";
export const router = Router();

// privates routes
router.use('/users',UsersController);
router.use('/auth',AuthController);
router.use('/assignments',AssignmentController);
router.use('/answers',AnswersController);
router.use('/assignmentScores',AssignmentScoreController);
// public routes
router.use('/public/users', PublicUsersController);

// ==================== RUTA DE PRUEBA PARA LOGGER ====================
// Esta ruta demuestra las capacidades del logger con Pino
// Eliminar después de probar
router.get('/test-logger', (req, res) => {
  // 1. Log automático de la petición HTTP (manejado por pino-http)
  
  // 2. Usar req.log para logging contextual (incluye info de la petición)
  req.log.info('Iniciando prueba del logger...');
  
  // 3. Logs con datos estructurados
  req.log.info({ 
    userId: 'test-user-123', 
    action: 'test-logger',
    metadata: { test: true }
  }, 'Log con datos estructurados');
  
  // 4. Probar redacción de datos sensibles
  const sensitiveData = {
    username: 'testuser',
    password: 'super-secret-password',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'refresh-token-secret',
    publicData: 'esto se puede ver'
  };
  req.log.info({ data: sensitiveData }, 'Log con datos sensibles (deben estar redactados)');
  
  // 5. Log de advertencia
  req.log.warn({ 
    reason: 'ejemplo de advertencia',
    timestamp: new Date()
  }, 'Este es un log de nivel WARN');
  
  // 6. Simular un error (sin lanzarlo)
  try {
    throw new Error('Error de ejemplo para testing');
  } catch (error) {
    req.log.error({ err: error }, 'Error capturado durante la prueba');
  }
  
  // 7. Usar el logger global directamente
  logger.info({ 
    source: 'logger-global',
    note: 'Este log viene del logger global, no de req.log'
  }, 'Log desde logger global');
  
  // Respuesta de éxito
  res.json({ 
    success: true,
    message: 'Prueba del logger completada. Revisa los logs en la consola.',
    info: {
      httpLogging: 'pino-http registra automáticamente la petición y respuesta',
      contextualLogging: 'req.log incluye contexto de la petición (requestId, etc)',
      redaction: 'Datos sensibles como passwords y tokens son redactados',
      levels: 'Diferentes niveles: info, warn, error',
      structured: 'Logs estructurados con JSON para fácil búsqueda'
    }
  });
});