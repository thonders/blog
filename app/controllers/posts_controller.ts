import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import Category from '#models/category'
import { DateTime } from 'luxon'

export default class PostsController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const posts = await Post.query()
      .where('status', 'published')
      .preload('user')
      .preload('categories')
      .orderBy('publishedAt', 'desc')
      .paginate(page, 10)

    return inertia.render('blog/index', {
      posts: posts.serialize(),
    })
  }

  async show({ params, inertia }: HttpContext) {
    const post = await Post.query()
      .where('slug', params.slug)
      .where('status', 'published')
      .preload('user')
      .preload('categories')
      .firstOrFail()

    return inertia.render('blog/show', {
      post: post.serialize(),
    })
  }

  async create({ inertia }: HttpContext) {
    const categories = await Category.all()

    return inertia.render('blog/create', {
      categories: categories.map((cat) => cat.serialize()),
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.only(['title', 'content', 'excerpt', 'status', 'categoryIds'])

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const post = await Post.create({
      ...data,
      slug,
      userId: auth.user!.id,
      publishedAt: data.status === 'published' ? DateTime.now() : null,
    })

    if (data.categoryIds && data.categoryIds.length > 0) {
      await post.related('categories').attach(data.categoryIds)
    }

    return response.redirect().toRoute('blog.show', { slug: post.slug })
  }

  async edit({ params, inertia }: HttpContext) {
    const post = await Post.query().where('slug', params.slug).preload('categories').firstOrFail()

    const categories = await Category.all()

    return inertia.render('blog/edit', {
      post: post.serialize(),
      categories: categories.map((cat) => cat.serialize()),
    })
  }

  async update({ params, request, response }: HttpContext) {
    const post = await Post.findByOrFail('slug', params.slug)
    const data = request.only(['title', 'content', 'excerpt', 'status', 'categoryIds'])

    if (data.title !== post.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    if (data.status === 'published' && post.status !== 'published') {
      data.publishedAt = DateTime.now()
    }

    await post.merge(data).save()

    if (data.categoryIds) {
      await post.related('categories').sync(data.categoryIds)
    }

    return response.redirect().toRoute('blog.show', { slug: post.slug })
  }

  async destroy({ params, response }: HttpContext) {
    const post = await Post.findByOrFail('slug', params.slug)
    await post.delete()

    return response.redirect().toRoute('blog.index')
  }
}
