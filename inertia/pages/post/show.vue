<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import App from '@/layouts/app.vue'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface User {
  id: string
  fullName: string
  username: string
  email: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  status: string
  user: User
  categories: Category[]
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  user: User
}

defineProps<{
  post: Post
}>()
</script>

<template>
  <Head :title="post.title">
    <meta name="description" :content="post.excerpt || post.title" />
    <meta property="og:title" :content="post.title" />
    <meta property="og:description" :content="post.excerpt || post.title" />
    <meta property="og:type" content="article" />
  </Head>

  <App>
    <div class="min-h-screen bg-background">
      <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href="/">Posts</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{{ post.title }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <article class="space-y-8">
          <header class="space-y-6">
            <div v-if="post.categories.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="category in post.categories"
                :key="category.id"
                class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {{ category.name }}
              </span>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {{ post.title }}
            </h1>

            <div
              class="flex items-center justify-between text-muted-foreground border-b border-border pb-6"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                >
                  {{ post.user.fullName.charAt(0) }}
                </div>
                <div>
                  <p class="text-foreground font-medium">{{ post.user.fullName }}</p>
                  <p class="text-sm">
                    Published on
                    {{
                      new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    }}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div class="prose prose-neutral dark:prose-invert prose-pre:rounded-lg max-w-none">
            <div v-html="post.content" />
          </div>

          <footer class="border-t border-border pt-8 mt-12">
            <div class="flex justify-between items-center">
              <Button variant="outline" as-child>
                <Link href="/">Back to Home</Link>
              </Button>

              <div class="text-center">
                <p class="text-muted-foreground text-sm">
                  Enjoyed this post? Share it with others!
                </p>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  </App>
</template>
