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

app.get('/', (req, res) => res.json({ ok: true, message: 'Presensi Madani API' }))

app.listen(port, () => console.log(`API listening on ${port}`))
