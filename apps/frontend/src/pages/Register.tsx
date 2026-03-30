import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/login.css'

const Register = () => {
  const navigate = useNavigate()
  const { isAuthenticated, register, registerLoading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/assets')
    }
  }, [isAuthenticated, navigate])

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message
      const validationError = error.response?.data?.errors?.[0]?.msg
      return message || validationError || 'Registration failed'
    }

    return error instanceof Error ? error.message : 'Registration failed'
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setNameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setApiError('')

    let isValid = true

    if (!name.trim()) {
      setNameError('Name is required')
      isValid = false
    }

    if (!email) {
      setEmailError('Email is required')
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email')
      isValid = false
    }

    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      isValid = false
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required')
      isValid = false
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match')
      isValid = false
    }

    if (!isValid) {
      return
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      })
      navigate('/assets')
    } catch (error) {
      setApiError(getErrorMessage(error))
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Account</h2>
        <p className="subtitle">Register to start uploading and sharing assets</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {nameError ? <p className="error-text">{nameError}</p> : null}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {emailError ? <p className="error-text">{emailError}</p> : null}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {passwordError ? <p className="error-text">{passwordError}</p> : null}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {confirmPasswordError ? <p className="error-text">{confirmPasswordError}</p> : null}
          </div>

          {apiError ? <p className="error-text">{apiError}</p> : null}

          <button type="submit" disabled={registerLoading}>
            {registerLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch-copy">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
