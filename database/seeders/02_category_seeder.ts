import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        userId: 1,
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about technology, programming, and software development',
      },
      {
        userId: 1,
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Posts about lifestyle, health, and personal development',
      },
      {
        userId: 1,
        name: 'Travel',
        slug: 'travel',
        description: 'Posts about travel, destinations, and adventures',
      },
      {
        userId: 1,
        name: 'Food',
        slug: 'food',
        description: 'Posts about cooking, recipes, and restaurant reviews',
      },
      {
        userId: 1,
        name: 'Business',
        slug: 'business',
        description: 'Posts about entrepreneurship, business strategies, and finance',
      },
    ])
  }
}
