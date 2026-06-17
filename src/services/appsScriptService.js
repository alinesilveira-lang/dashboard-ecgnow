const PROXY_URL = 'http://localhost:3002/api/proxy'

function getPassword() {
  return sessionStorage.getItem('dashboardPassword')
}

function setPassword(password) {
  sessionStorage.setItem('dashboardPassword', password)
}

export async function authenticate(password) {
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'authenticate',
        password
      })
    })

    const data = await response.json()

    if (data.success) {
      setPassword(password)
      localStorage.setItem('dashboardAuth', 'true')
      return { success: true, data }
    }

    return { success: false, error: data.message }
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return { success: false, error: 'Erro ao conectar com servidor' }
  }
}

export async function fetchDados() {
  try {
    const password = getPassword()

    if (!password) {
      return { success: false, error: 'Não autenticado' }
    }

    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'getData',
        password
      })
    })

    const data = await response.json()

    if (data.success) {
      return { success: true, data: data.data }
    }

    return { success: false, error: data.message }
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    return { success: false, error: 'Erro ao buscar dados' }
  }
}

export function isAuthenticated() {
  return localStorage.getItem('dashboardAuth') === 'true'
}

export function logout() {
  sessionStorage.removeItem('dashboardPassword')
  localStorage.removeItem('dashboardAuth')
}
