import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import Category from '#models/category'
import { DateTime } from 'luxon'

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
      .orderBy('publishedAt', 'desc')
      .paginate(page, 10)

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

    if (!auth.user) {
      query.where('status', 'published')
    } else {
      query.where((builder) => {
        builder.where('status', 'published').orWhere('userId', auth.user!.id)
      })
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
    const data = request.only(['title', 'content', 'excerpt', 'status', 'categoryIds'])

    // Extract categoryIds separately
    const { categoryIds, ...postData } = data

    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const post = await Post.create({
      ...postData,
      slug,
      userId: auth.user!.id,
      publishedAt: postData.status === 'published' ? DateTime.now() : null,
    })

    if (categoryIds && categoryIds.length > 0) {
      await post.related('categories').attach(categoryIds)
    }

    return response.redirect().toRoute('blog.show', { slug: post.slug })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const post = await Post.findByOrFail('slug', params.slug)

    if (post.userId !== auth.user!.id) {
      return response.abort('You can only edit your own posts', 403)
    }

    const data = request.only(['title', 'content', 'excerpt', 'status', 'categoryIds'])

    // Extract categoryIds separately
    const { categoryIds, ...postData } = data

    if (postData.title !== post.title) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    if (postData.status === 'published' && post.status !== 'published') {
      postData.publishedAt = DateTime.now()
    }

    await post.merge(postData).save()

    if (categoryIds !== undefined) {
      await post.related('categories').sync(categoryIds)
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
