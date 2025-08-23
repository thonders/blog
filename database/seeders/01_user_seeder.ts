import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      fullName: 'Admin',
      username: 'admin',
      email: 'admin@thond.re',
      password: 'Password.123',
    })
  }
}
