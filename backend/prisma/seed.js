const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  const pw = await bcrypt.hash('admin123', 10)
  const exists = await prisma.user.findUnique({ where: { email: 'admin@madani.local' } })
  if (!exists) {
    await prisma.user.create({ data: { name: 'Admin', email: 'admin@madani.local', passwordHash: pw, role: 'admin' } })
    console.log('Created admin@madani.local / admin123')
  } else console.log('Admin user exists')
}

main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>prisma.$disconnect())
