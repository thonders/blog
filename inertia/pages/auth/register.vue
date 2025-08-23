<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'
import App from '@/layouts/app.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const form = useForm({
  fullName: '',
  username: '',
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

  <App>
    <div
      class="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full">
        <div :class="cn('flex flex-col gap-6')">
          <Card>
            <CardHeader class="text-center">
              <CardTitle class="text-xl">Create your account</CardTitle>
              <CardDescription>Sign up to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="submit">
                <div class="grid gap-6">
                  <div class="flex flex-col gap-4">
                    <Button variant="outline" class="w-full" type="button">
                      <Icon icon="akar-icons:google-fill" class="size-5" />
                      Sign up with Google
                    </Button>
                  </div>
                  <div
                    class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
                  >
                    <span class="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div class="grid gap-6">
                    <div class="grid gap-3">
                      <Label for="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        v-model="form.fullName"
                        type="text"
                        placeholder="John Smith"
                        required
                      />
                      <div v-if="form.errors.fullName" class="text-destructive text-sm">
                        {{ form.errors.fullName }}
                      </div>
                    </div>
                    <div class="grid gap-3">
                      <Label for="username">Username</Label>
                      <Input
                        id="username"
                        v-model="form.username"
                        type="text"
                        placeholder="johnsmith"
                        required
                      />
                      <div v-if="form.errors.username" class="text-destructive text-sm">
                        {{ form.errors.username }}
                      </div>
                    </div>
                    <div class="grid gap-3">
                      <Label for="email">Email</Label>
                      <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="john@smith.com"
                        required
                      />
                      <div v-if="form.errors.email" class="text-destructive text-sm">
                        {{ form.errors.email }}
                      </div>
                    </div>
                    <div class="grid gap-3">
                      <Label for="password">Password</Label>
                      <Input id="password" v-model="form.password" type="password" required />
                      <div v-if="form.errors.password" class="text-destructive text-sm">
                        {{ form.errors.password }}
                      </div>
                    </div>
                    <div class="grid gap-3">
                      <Label for="password_confirmation">Confirm Password</Label>
                      <Input
                        id="password_confirmation"
                        v-model="form.password_confirmation"
                        type="password"
                        required
                      />
                      <div
                        v-if="form.errors.password_confirmation"
                        class="text-destructive text-sm"
                      >
                        {{ form.errors.password_confirmation }}
                      </div>
                    </div>
                    <Button type="submit" class="w-full" :disabled="form.processing">
                      {{ form.processing ? 'Creating account...' : 'Create account' }}
                    </Button>
                  </div>
                  <div class="text-center text-sm">
                    Already have an account?
                    <Link
                      href="/login"
                      class="underline underline-offset-4 hover:text-primary transition"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div class="text-muted-foreground text-center text-xs text-balance">
            By clicking continue, you agree to our
            <a href="#" class="underline underline-offset-4 hover:text-primary">Terms of Service</a>
            and
            <a href="#" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  </App>
</template>
