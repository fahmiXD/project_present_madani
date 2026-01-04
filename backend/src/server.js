require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000
const prisma = require('./prisma')

app.use(cors())
app.use(express.json({ limit: '5mb' }))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/attendance', require('./routes/attendance'))
app.use('/debug', require('./routes/debug'))

app.get('/', (req, res) => res.json({ ok: true, message: 'Presensi Madani API' }))

const server = app.listen(port, () => console.log(`API listening on ${port}`))

server.on('error', (err) => {
	if (err && err.code === 'EADDRINUSE') {
		console.error(`Port ${port} is already in use. Another process is listening on this port.`)
		console.error('Use `netstat -ano | findstr :4000` then `taskkill /PID <pid> /F` on Windows to free the port.')
		process.exit(1)
	}
	console.error('Server error:', err)
	process.exit(1)
})
