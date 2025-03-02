import { ZodString } from 'zod'
/**
 * Takes a schema and data and validates.
 * Remaps the zod errors into a key-value map of the field name and its first error message.
 * Discriminates between success: true and false for TS simplicity
 */
type Success = { success: true; errors?: undefined }
type Fail = {
  error: string
  success: false
}
export const validateZodStringSchema = (
  schema: ZodString,
  data: string
): Success | Fail => {
  const result = schema.safeParse(data)
  if (!result.success) {
    const zodErrors = result.error.formErrors.formErrors as string[]
    return { error: zodErrors[0], success: false }
  }

  return { success: true }
}
