import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import vine from '@vinejs/vine'

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    return response.redirect().toRoute('blog.index')
  }

  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async register({ request, response, auth }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        fullName: vine.string().trim().minLength(2).maxLength(100).optional(),
        email: vine
          .string()
          .trim()
          .email()
          .unique(async (db, value) => {
            const user = await db.from('users').where('email', value).first()
            return !user
          }),
        password: vine.string().minLength(6).confirmed(),
      })
    )

    const data = await request.validateUsing(validator)

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

    await auth.use('web').login(user)

    return response.redirect().toRoute('blog.index')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login')
  }
}
