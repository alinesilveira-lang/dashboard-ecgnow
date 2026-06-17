import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = 3002

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVhK3QN_57PK9jENa54yaJzObs2-eK5me4w0T6ZttMvybpXI8XQyPGouHQ2Shxg8U1/exec'

app.use(cors())
app.use(express.json())

// ========== WEBHOOK HOTMART ==========
app.post('/api/webhook/hotmart', async (req, res) => {
  try {
    console.log('🔔 Webhook Hotmart recebido:', req.body)

    const evento = req.body

    // Processar diferentes tipos de eventos
    if (evento.status === 'aproved' || evento.status === 'completed') {
      console.log('✅ Compra aprovada detectada!')
      console.log('📧 Email:', evento.buyer?.email)
      console.log('💰 Valor:', evento.price)
      console.log('📦 Produto:', evento.product?.name)

      // Aqui você pode:
      // 1. Salvar em arquivo JSON
      // 2. Adicionar à Google Sheets
      // 3. Notificar o Dashboard

      res.json({ success: true, message: 'Webhook processado' })
    } else {
      console.log('⚠️ Evento não processado:', evento.status)
      res.json({ success: true, message: 'Evento recebido mas não processado' })
    }
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ========== PROXY APPS SCRIPT ==========
app.post('/api/proxy', async (req, res) => {
  try {
    console.log('Requisição recebida:', req.body)

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })

    console.log('Resposta do Apps Script:', response.status)

    const text = await response.text()
    console.log('Conteúdo da resposta:', text)

    try {
      const data = JSON.parse(text)
      res.json(data)
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError)
      res.status(500).json({
        success: false,
        message: 'Resposta inválida do servidor',
        raw: text
      })
    }
  } catch (error) {
    console.error('Erro no proxy:', error.message)
    res.status(500).json({
      success: false,
      message: 'Erro ao conectar com servidor',
      error: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`API proxy rodando em http://localhost:${PORT}`)
})
