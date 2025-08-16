/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/', '#controllers/posts_controller.index').as('blog.index')
router.get('/:slug', '#controllers/posts_controller.show').as('blog.show')

router
  .group(() => {
    router.post('/posts', '#controllers/posts_controller.store').as('blog.store')
    router.put('/posts/:slug', '#controllers/posts_controller.update').as('blog.update')
    router.delete('/posts/:slug', '#controllers/posts_controller.destroy').as('blog.destroy')
  })
  .use(middleware.auth())
