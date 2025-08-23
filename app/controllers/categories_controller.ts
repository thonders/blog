import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Category from '#models/category'
import vine from '@vinejs/vine'

export default class CategoriesController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)

    const query = Category.query()

    const categories = await query.preload('user').orderBy('created_at', 'desc').paginate(page, 10)

    return inertia.render('category/index', {
      categories: categories.serialize(),
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(2).maxLength(100),
        description: vine.string().trim().maxLength(500).optional(),
      })
    )

    const data = await request.validateUsing(validator)

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category = await Category.create({
      name: data.name,
      description: data.description,
      slug,
      userId: auth.user!.id,
    })

    return response.redirect().toRoute('categories.show', {
      username: auth.user!.username,
      slug: category.slug,
    })
  }

  async show({ params, inertia, auth }: HttpContext) {
    const user = await User.findByOrFail('username', params.username)

    const query = Category.query().where('slug', params.slug).where('userId', user.id)

    const category = await query
      .preload('user')
      .preload('posts', (postsQuery) => {
        if (auth.user) {
          postsQuery.where((builder) => {
            builder.where('status', 'published').orWhere('userId', auth.user!.id)
          })
        } else {
          postsQuery.where('status', 'published')
        }
        postsQuery.preload('user')
        postsQuery.orderBy('published_at', 'desc')
        postsQuery.orderBy('created_at', 'desc')
      })
      .firstOrFail()

    return inertia.render('category/show', {
      category: category.serialize(),
    })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const category = await Category.findByOrFail('slug', params.slug)

    if (category.userId !== auth.user!.id) {
      return response.abort('You can only edit your own categories', 403)
    }

    await category.load('user')

    const validator = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(2).maxLength(100),
        description: vine.string().trim().maxLength(500).optional(),
      })
    )

    const data = await request.validateUsing(validator)

    let slug = category.slug
    if (data.name !== category.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    await category
      .merge({
        name: data.name,
        description: data.description,
        slug,
      })
      .save()

    return response.redirect().toRoute('categories.show', {
      username: category.user.username,
      slug: category.slug,
    })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const category = await Category.findByOrFail('slug', params.slug)

    if (category.userId !== auth.user!.id) {
      return response.abort('You can only delete your own categories', 403)
    }

    await category.delete()

    return response.redirect().toRoute('categories.index')
  }
}
