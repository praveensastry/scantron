const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Add seeds here
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.disconnect()
  })
