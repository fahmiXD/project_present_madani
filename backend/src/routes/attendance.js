const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const fs = require('fs')
const path = require('path')

// helper: Haversine distance in meters
function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180 }
  const R = 6371e3 // meters
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../../backend_uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// Check-in endpoint: expects { userId, lat, lon, photo } where photo may be dataURL
router.post('/checkin', async (req, res) => {
  try {
    const { userId, lat, lon, photo } = req.body
    if (!userId || lat === undefined || lon === undefined) return res.status(400).json({ error: 'Missing data' })

    const now = new Date()

    // Prevent double check-in: if there's an attendance for this user without checkOutAt, reject
    const open = await prisma.attendance.findFirst({ where: { userId: parseInt(userId), checkOutAt: null } })
    if (open) return res.status(400).json({ error: 'Already checked-in (no checkout). Please checkout first.' })

    // Find an active schedule that contains current server time
    const schedule = await prisma.schedule.findFirst({ where: { startTime: { lte: now }, endTime: { gte: now } }, orderBy: { startTime: 'asc' } })
    if (!schedule) return res.status(400).json({ error: 'No active schedule at this time' })

    // Check radius
    const distance = haversineDistance(parseFloat(lat), parseFloat(lon), schedule.lat, schedule.lon)
    if (distance > schedule.radius) return res.status(400).json({ error: `Outside allowed radius (${Math.round(distance)}m from schedule center)` })

    // Save photo if provided (data URL)
    let savedPath = null
    if (photo && typeof photo === 'string' && photo.startsWith('data:')) {
      const matches = photo.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/)
      if (matches) {
        const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2]
        const data = Buffer.from(matches[3], 'base64')
        const fname = `att_${userId}_${Date.now()}.${ext}`
        const p = path.join(uploadsDir, fname)
        fs.writeFileSync(p, data)
        savedPath = `backend_uploads/${fname}`
      }
    }

    const attendance = await prisma.attendance.create({ data: { userId: parseInt(userId), scheduleId: schedule.id, lat: parseFloat(lat), lon: parseFloat(lon), photoPath: savedPath, checkInAt: now } })
    res.json({ ok: true, attendance })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/checkout', async (req, res) => {
  try {
    const { attendanceId } = req.body
    if (!attendanceId) return res.status(400).json({ error: 'Missing attendanceId' })
    const att = await prisma.attendance.update({ where: { id: parseInt(attendanceId) }, data: { checkOutAt: new Date() } })
    res.json({ ok: true, att })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/history/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId)
  if (!userId) return res.status(400).json({ error: 'Missing userId' })
  const data = await prisma.attendance.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  res.json({ ok: true, data })
})

module.exports = router
