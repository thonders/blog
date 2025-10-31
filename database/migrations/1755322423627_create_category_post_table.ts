import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'category_post'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table
        .uuid('category_id')
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.unique(['post_id', 'category_id'])
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
