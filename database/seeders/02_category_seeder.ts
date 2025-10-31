import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const adminUser = await User.findByOrFail('email', 'admin@thond.re')

    await Category.createMany([
      {
        userId: adminUser.id,
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about technology, programming, and software development.',
      },
      {
        userId: adminUser.id,
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Posts about lifestyle, health, and personal development.',
      },
      {
        userId: adminUser.id,
        name: 'Travel',
        slug: 'travel',
        description: 'Posts about travel, destinations, and adventures.',
      },
      {
        userId: adminUser.id,
        name: 'Food',
        slug: 'food',
        description: 'Posts about cooking, recipes, and restaurant reviews.',
      },
      {
        userId: adminUser.id,
        name: 'Business',
        slug: 'business',
        description: 'Posts about entrepreneurship, business strategies, and finance.',
      },
    ])
  }
}
