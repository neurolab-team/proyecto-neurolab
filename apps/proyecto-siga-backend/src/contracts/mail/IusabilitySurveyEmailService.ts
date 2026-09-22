/**
 * Envío del correo con el link a la encuesta externa de usabilidad, disparado
 * cuando el usuario completa las 3 pruebas de sueño (EPWORTH, PSQI, MUNICH).
 * Es el respaldo garantizado: se manda siempre, sin importar si el usuario
 * llega a ver el modal dentro de la plataforma.
 */
export interface IUsabilitySurveyEmailService {
  sendUsabilitySurveyEmail(email: string, name: string): Promise<void>;
}
