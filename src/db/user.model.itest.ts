import closeDbConnection from '../testUtils/tearDownIntegrationTests'
import { prisma } from './prisma'
import { create, getById } from './user.model'

describe('Example user model integration test', () => {
  afterAll(async () => {
    // Clean up the table we wrote to so that we don't pollute
    prisma.user.deleteMany()
    // Close the connection so that your integration test doesn't hang
    await closeDbConnection()
  })

  test('gets user by ID', async () => {
    const createdUser = await prisma.user.create({ data: { name: 'Jon' } })
    const result = await getById(createdUser.id)
    expect(result?.name).toEqual('Jon')
  })

  test('creates user', async () => {
    await create('Joe')
    const user = prisma.user.findFirst({ where: { name: 'Joe' } })
    expect(user).toBeTruthy()
  })
})
