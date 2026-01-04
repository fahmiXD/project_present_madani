const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Health / debug endpoint
router.get('/ping', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() })
})

// Improved login with clearer errors and server-side logging
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      console.warn('Auth: missing credentials', { emailProvided: !!email })
      return res.status(400).json({ error: 'Missing email or password' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.warn('Auth: user not found', { email })
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      console.warn('Auth: invalid password', { email })
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'dev', { expiresIn: '8h' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Auth error', err)
    res.status(500).json({ error: 'Server error during authentication' })
  }
})

module.exports = router
