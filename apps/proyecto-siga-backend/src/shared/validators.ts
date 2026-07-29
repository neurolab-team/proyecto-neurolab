import { z } from 'zod'


export const CommonValidators = {
 
  id: z.uuid(),
  
 
  name: z.string().min(1).trim(),
  alias: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),

  email: z.string().min(3).trim().transform((s) => s.toLowerCase()),
  password: z.string().min(1),
  role: z.enum(['admin', 'user', 'psychologist']),
  
 
  pagination: z.object({
    limit: z.coerce.number().int().min(1).max(1000).default(100),
    offset: z.coerce.number().int().min(0).default(0)
  })
}


export const CommonDtos = {

  IdParam: z.object({
    id: CommonValidators.id
  }),
  
  UserIdParam: z.object({
    userId: CommonValidators.id
  }),

  AssignmentIdParam: z.object({
    assignmentId: CommonValidators.id
  }),

  PaginatedQuery: z.object({
    limit: z.coerce.number().int().min(1).max(1000).default(100),
    offset: z.coerce.number().int().min(0).default(0)
  }),  

  BaseEntity: z.object({
    name: CommonValidators.name,
    alias: CommonValidators.alias,
    description: CommonValidators.description
  })
}


export const createUpdateDto = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(
    Object.entries(shape).reduce((acc, [key, validator]) => {
      acc[key] = (validator as z.ZodTypeAny).optional()
      return acc
    }, {} as any)
  )
}