<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'

const form = useForm({
  fullName: '',
  email: '',
  password: '',
  password_confirmation: '',
})

function submit() {
  form.post('/register')
}
</script>

<template>
  <Head title="Register" />

  <div class="min-h-screen bg-sand-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-sand-12">Create your account</h2>
        <p class="mt-2 text-center text-sm text-sand-11">
          Or
          <Link href="/login" class="font-medium text-primary hover:text-primary/80 transition">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <form @submit.prevent="submit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-sand-12 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Enter your full name"
            />
            <div v-if="form.errors.fullName" class="text-red-500 text-sm mt-1">
              {{ form.errors.fullName }}
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-sand-12 mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
            />
            <div v-if="form.errors.email" class="text-red-500 text-sm mt-1">
              {{ form.errors.email }}
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-sand-12 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Enter your password"
            />
            <div v-if="form.errors.password" class="text-red-500 text-sm mt-1">
              {{ form.errors.password }}
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-sand-12 mb-2">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Confirm your password"
            />
            <div v-if="form.errors.password_confirmation" class="text-red-500 text-sm mt-1">
              {{ form.errors.password_confirmation }}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="form.processing"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-50"
          >
            {{ form.processing ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
