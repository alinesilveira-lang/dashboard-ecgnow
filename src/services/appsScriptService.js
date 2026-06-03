import axios from 'axios'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent'

export async function authenticate(password) {
  try {
    const response = await axios.post(APPS_SCRIPT_URL, {
      action: 'authenticate',
      password
    })

    if (response.data.success) {
      localStorage.setItem('dashboardAuth', 'true')
      localStorage.setItem('authToken', response.data.token)
      return { success: true, data: response.data }
    }

    return { success: false, error: response.data.error }
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return { success: false, error: 'Erro ao conectar com servidor' }
  }
}

export async function fetchDados() {
  try {
    const token = localStorage.getItem('authToken')

    if (!token) {
      return { success: false, error: 'Não autenticado' }
    }

    const response = await axios.post(APPS_SCRIPT_URL, {
      action: 'getData',
      token
    })

    if (response.data.success) {
      return { success: true, data: response.data.data }
    }

    return { success: false, error: response.data.error }
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    return { success: false, error: 'Erro ao buscar dados' }
  }
}

export function isAuthenticated() {
  return localStorage.getItem('dashboardAuth') === 'true'
}

export function logout() {
  localStorage.removeItem('dashboardAuth')
  localStorage.removeItem('authToken')
}
