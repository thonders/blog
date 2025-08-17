import type { HttpContext } from '@adonisjs/core/http'
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
      .paginate(page, 2)

    const categories = await Category.all()

    return inertia.render('blog/index', {
      posts: posts.serialize(),
      categories: categories.map((cat) => cat.serialize()),
      auth: {
        user: auth.user ? auth.user.serialize() : null,
      },
    })
  }

  async show({ params, inertia, auth }: HttpContext) {
    const query = Post.query().where('slug', params.slug)

    if (auth.user) {
      query.where((builder) => {
        builder.where('status', 'published').orWhere('userId', auth.user!.id)
      })
    } else {
      query.where('status', 'published')
    }

    const post = await query.preload('user').preload('categories').firstOrFail()

    return inertia.render('blog/show', {
      post: post.serialize(),
      auth: {
        user: auth.user ? auth.user.serialize() : null,
      },
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        title: vine.string().trim().minLength(2).maxLength(255),
        content: vine.string().trim().minLength(10),
        excerpt: vine.string().trim().maxLength(500).optional(),
        status: vine.enum(['draft', 'published']),
        categoryIds: vine.array(vine.number()).optional(),
      })
    )

    const data = await request.validateUsing(validator)

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

    return response.redirect().toRoute('blog.show', { slug: post.slug })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const post = await Post.findByOrFail('slug', params.slug)

    if (post.userId !== auth.user!.id) {
      return response.abort('You can only edit your own posts', 403)
    }

    const validator = vine.compile(
      vine.object({
        title: vine.string().trim().minLength(2).maxLength(255),
        content: vine.string().trim().minLength(10),
        excerpt: vine.string().trim().maxLength(500).optional(),
        status: vine.enum(['draft', 'published']),
        categoryIds: vine.array(vine.number()).optional(),
      })
    )

    const data = await request.validateUsing(validator)

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

    return response.redirect().toRoute('blog.show', { slug: post.slug })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const post = await Post.findByOrFail('slug', params.slug)

    if (post.userId !== auth.user!.id) {
      return response.abort('You can only delete your own posts', 403)
    }

    await post.delete()

    return response.redirect().toRoute('blog.index')
  }
}
