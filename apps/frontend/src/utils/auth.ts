import axios from 'axios'

export const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const getAuthErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    const validationError = error.response?.data?.errors?.[0]?.msg

    return message || validationError || fallbackMessage
  }

  return error instanceof Error ? error.message : fallbackMessage
}
