const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

// Temporary debug route to list users. Only enabled when NODE_ENV !== 'production'
router.get('/users', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Forbidden' })
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } })
    res.json({ ok: true, users })
  } catch (err) {
    console.error('Debug/users error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
