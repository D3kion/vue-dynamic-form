import z from 'zod'

export const authOptions = [
  { value: 'plain', label: 'Локальная' },
  { value: 'ldap', label: 'LDAP' },
]

export const accountSchema = z
  .object({
    type: z.enum(['plain', 'ldap']),
    tags: z.string().max(50),
    // .transform((val) => tagsFromString(val)) // 2 hour of wasted time, could be done with separate form state, but @primevue/forms hasn't want to validate deeply nested forms
    login: z.string().min(1).max(100),
    password: z.string().max(100).nullable(),
  })
  .refine(
    (s) => {
      if (s.type === 'ldap') return true
      return s.type === 'plain' && s.password
    },
    { path: ['password'] },
  )

export const accountsFormSchema = z.array(accountSchema)

export type Account = z.infer<typeof accountSchema>
