import swaggerAutogen from 'swagger-autogen';
const doc = {
  info: {
    title: 'Neurolab API',
    description: 'Documentación de API generada automáticamente',
  },
  host: 'localhost:6001/api',
  schemes: ['http'],
  securityDefinitions: {
    SessionIdAuth: {
      type: 'apiKey',
      name: 'x-session-id',
      in: 'header',
      description: 'Introduce el identificador de sesión enviado por el BFF en el header x-session-id'
    }
  },
  security: [{ SessionIdAuth: [] }]
};

const outputFile = './swagger-output.json'; 
const endpointsFiles = ['../../apps/proyecto-siga-backend/src/routes/routes.ts']; 

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)
