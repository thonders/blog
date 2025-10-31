import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Post from '#models/post'
import Category from '#models/category'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'

export default class PostsController {
  async index({ inertia, request, auth }: HttpContext) {
    const page = request.input('page', 1)

    const query = Post.query()

    if (auth.user) {
      query.where((builder) => {
        builder.where('status', 'published').orWhere('userId', auth.user!.id)
      })
    } else {
      query.where('status', 'published')
    }

    const posts = await query
      .preload('user')
      .preload('categories')
      .orderBy('published_at', 'desc')
      .orderBy('created_at', 'desc')
      .paginate(page, 10)

    const categories = auth.user
      ? await Category.query().where('userId', auth.user.id).orderBy('name', 'asc')
      : []

    return inertia.render('post/index', {
      posts: posts.serialize(),
      categories: categories.map((cat) => cat.serialize()),
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        title: vine.string().trim().minLength(2).maxLength(255),
        content: vine.string().trim().minLength(10),
        excerpt: vine.string().trim().maxLength(500).optional(),
        status: vine.enum(['draft', 'published']),
        categoryIds: vine.array(vine.string().uuid()).optional(),
      })
    )

    const data = await request.validateUsing(validator)

    if (data.categoryIds && data.categoryIds.length > 0) {
      const userCategories = await Category.query()
        .where('userId', auth.user!.id)
        .whereIn('id', data.categoryIds)

      if (userCategories.length !== data.categoryIds.length) {
        return response.abort('You can only use your own categories', 403)
      }
    }

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const post = await Post.create({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      status: data.status,
      slug,
      userId: auth.user!.id,
      publishedAt: data.status === 'published' ? DateTime.now() : null,
    })

    if (data.categoryIds && data.categoryIds.length > 0) {
      await post.related('categories').attach(data.categoryIds)
    }

    return response.redirect().toRoute('posts.show', {
      username: auth.user!.username,
      slug: post.slug,
    })
  }

  async show({ params, inertia, auth }: HttpContext) {
    const user = await User.findByOrFail('username', params.username)

    const query = Post.query().where('slug', params.slug).where('userId', user.id)

    if (auth.user) {
      query.where((builder) => {
        builder.where('status', 'published').orWhere('userId', auth.user!.id)
      })
    } else {
      query.where('status', 'published')
    }

    const post = await query.preload('user').preload('categories').firstOrFail()

    return inertia.render('post/show', {
      post: post.serialize(),
    })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const post = await Post.findByOrFail('slug', params.slug)

    if (post.userId !== auth.user!.id) {
      return response.abort('You can only edit your own posts', 403)
    }

    await post.load('user')

    const validator = vine.compile(
      vine.object({
        title: vine.string().trim().minLength(2).maxLength(255),
        content: vine.string().trim().minLength(10),
        excerpt: vine.string().trim().maxLength(500).optional(),
        status: vine.enum(['draft', 'published']),
        categoryIds: vine.array(vine.string().uuid()).optional(),
      })
    )

    const data = await request.validateUsing(validator)

    if (data.categoryIds && data.categoryIds.length > 0) {
      const userCategories = await Category.query()
        .where('userId', auth.user!.id)
        .whereIn('id', data.categoryIds)

      if (userCategories.length !== data.categoryIds.length) {
        return response.abort('You can only use your own categories', 403)
      }
    }

    let slug = post.slug
    if (data.title !== post.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    let publishedAt = post.publishedAt
    if (data.status === 'published' && post.status !== 'published') {
      publishedAt = DateTime.now()
    }

    await post
      .merge({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        slug: slug,
        publishedAt: publishedAt,
      })
      .save()

    if (data.categoryIds !== undefined) {
      await post.related('categories').sync(data.categoryIds)
    }

    return response.redirect().toRoute('posts.show', {
      username: post.user.username,
      slug: post.slug,
    })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const post = await Post.findByOrFail('slug', params.slug)

    if (post.userId !== auth.user!.id) {
      return response.abort('You can only delete your own posts', 403)
    }

    await post.delete()

    return response.redirect().toRoute('posts.index')
  }
}
