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

router.get('/', '#controllers/posts_controller.index').as('posts.index')
router.get('/p/:slug', '#controllers/posts_controller.show').as('posts.show')

router.get('/categories', '#controllers/categories_controller.index').as('categories.index')
router.get('/categories/:slug', '#controllers/categories_controller.show').as('categories.show')

router
  .group(() => {
    router.post('/posts', '#controllers/posts_controller.store').as('posts.store')
    router.put('/posts/:slug', '#controllers/posts_controller.update').as('posts.update')
    router.delete('/posts/:slug', '#controllers/posts_controller.destroy').as('posts.destroy')

    router.post('/categories', '#controllers/categories_controller.store').as('categories.store')
    router
      .put('/categories/:slug', '#controllers/categories_controller.update')
      .as('categories.update')
    router
      .delete('/categories/:slug', '#controllers/categories_controller.destroy')
      .as('categories.destroy')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/login', '#controllers/auth_controller.showLogin').as('auth.login')
    router.post('/login', '#controllers/auth_controller.login')
    router.get('/register', '#controllers/auth_controller.showRegister').as('auth.register')
    router.post('/register', '#controllers/auth_controller.register')
  })
  .use(middleware.guest())

router
  .post('/logout', '#controllers/auth_controller.logout')
  .as('auth.logout')
  .use(middleware.auth())
