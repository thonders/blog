import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about technology, programming, and software development',
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Posts about lifestyle, health, and personal development',
      },
      {
        name: 'Travel',
        slug: 'travel',
        description: 'Posts about travel, destinations, and adventures',
      },
      {
        name: 'Food',
        slug: 'food',
        description: 'Posts about cooking, recipes, and restaurant reviews',
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Posts about entrepreneurship, business strategies, and finance',
      },
    ])
  }
}
