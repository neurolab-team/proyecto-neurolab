# Security rollout checklist

## 1) CORS
- [ ] Definir `CORS_ORIGINS` en backend (`https://tu-frontend.com,https://staging-frontend.com`)
- [ ] Probar origen permitido
- [ ] Probar origen bloqueado

## 2) Rate limiting
- [ ] Verificar `429` en `/api/auth/login`
- [ ] Verificar `429` en `/api/public/users/register`
- [ ] Verificar `429` en `/api/public/users/resend-verification`

## 3) Headers de seguridad
- [ ] Confirmar `helmet` activo en backend
- [ ] Confirmar headers de Nginx (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)

## 4) Password/token randomness
- [ ] Revisar que no existan usos de `Math.random()` para secretos

## 5) Validación final
- [ ] Ejecutar lint
- [ ] Ejecutar tests backend
- [ ] Smoke test login/registro/reenvío
