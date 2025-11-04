type Opts = {
  minLength: number
  requireClasses: number
  blockEmailPart: boolean
}


const rx = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  digit: /\d/,
  symbol: /[^A-Za-z0-9]/,
}


const veryCommon = new Set([
  'password','123456','123456789','qwerty','admin','111111','123123','abc123','letmein','iloveyou'
])


const optsFromEnv = (): Opts => ({
  minLength: Number(process.env.PASSWORD_MIN_LENGTH ?? 10),
  requireClasses: Number(process.env.PASSWORD_REQUIRE_CLASSES ?? 3),
  blockEmailPart: (process.env.PASSWORD_BLOCK_EMAIL_PART ?? 'true') === 'true',
  
})


const errorMessages = {
  length: (minLength: number) => `La contraseña debe tener al menos ${minLength} caracteres`,
  classes: (requireClasses: number) => `Debe incluir al menos ${requireClasses} tipos de caracteres : (mayúscula, minúscula, numero, caracter especial)`,
  common: 'Contraseña demasiado común',
  emailPart: 'No debe contener el usuario del email',  
}


function checkLength(pw: string, minLength: number): string | null {
  return pw.length < minLength ? errorMessages.length(minLength) : null
}

function checkClasses(pw: string, requireClasses: number): string | null {
  let classes = 0
  if (rx.upper.test(pw)) classes++
  if (rx.lower.test(pw)) classes++
  if (rx.digit.test(pw)) classes++
  if (rx.symbol.test(pw)) classes++
  return classes < requireClasses ? errorMessages.classes(requireClasses) : null
}

function checkVeryCommon(pw: string): string | null {
  return veryCommon.has(pw.toLowerCase()) ? errorMessages.common : null
}


export async function checkPassword(
  password: string,
): Promise<string[]> {
  const o = optsFromEnv()
  const pw = (password ?? '').trim()
  const errs: string[] = []

  const lengthErr = checkLength(pw, o.minLength)
  if (lengthErr) errs.push(lengthErr)

  const classesErr = checkClasses(pw, o.requireClasses)
  if (classesErr) errs.push(classesErr)

  const commonErr = checkVeryCommon(pw)
  if (commonErr) errs.push(commonErr)


  return errs
}
