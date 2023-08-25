import { prisma } from "./db/prisma"

async function greet() {
  const user = await prisma.user.findFirst()
  console.log(`Hello, world! My name is ${user?.name}.`)
}

greet()
