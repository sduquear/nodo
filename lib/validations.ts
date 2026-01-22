/**
 * Resultado de una validación
 */
export type ValidationResult = {
  valid: boolean;
  error?: string;
};

/**
 * Valida un username
 * - Mínimo 3 caracteres
 * - Solo letras, números y guión bajo
 */
export function validateUsername(username: string | null | undefined): ValidationResult {
  if (!username || username.length < 3) {
    return {
      valid: false,
      error: "Username must be at least 3 characters",
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { valid: true };
}
