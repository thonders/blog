<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import App from '@/layouts/app.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  posts: Post[]
}

defineProps<{
  category: Category
}>()
</script>

<template>
  <Head :title="category.name">
    <meta name="description" :content="category.description || category.name" />
    <meta property="og:title" :content="category.name" />
    <meta property="og:description" :content="category.description || category.name" />
  </Head>

  <App>
    <div class="min-h-screen bg-background">
      <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href="/categories">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{{ category.name }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <article class="space-y-8">
          <header class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-4">
                <h1 class="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {{ category.name }}
                </h1>

                <p v-if="category.description" class="text-xl text-muted-foreground">
                  {{ category.description }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-between text-muted-foreground border-b border-border pb-6"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                >
                  {{ category.user.fullName.charAt(0) }}
                </div>
                <div>
                  <p class="text-foreground font-medium">{{ category.user.fullName }}</p>
                  <p class="text-sm">
                    Created on
                    {{
                      new Date(category.createdAt).toLocaleDateString('en-UK', {
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

          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-foreground">
              Posts in this category
              <span class="text-muted-foreground text-lg font-normal">
                ({{ category.posts.length }})
              </span>
            </h2>

            <div v-if="category.posts.length > 0" class="space-y-6">
              <Card
                v-for="post in category.posts"
                :key="post.id"
                class="hover:shadow-md transition-shadow"
              >
                <CardContent>
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-foreground mb-2">
                        <Link
                          :href="`/${post.user.username}/p/${post.slug}`"
                          class="hover:text-primary transition-colors"
                        >
                          {{ post.title }}
                        </Link>
                      </h3>

                      <p v-if="post.excerpt" class="text-muted-foreground mb-4 line-clamp-2">
                        {{ post.excerpt }}
                      </p>

                      <div class="flex items-center justify-between text-sm text-muted-foreground">
                        <div class="flex items-center space-x-2">
                          <div
                            class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                          >
                            {{ post.user.fullName.charAt(0) }}
                          </div>
                          <span>{{ post.user.fullName }}</span>
                        </div>
                        <div class="flex items-center space-x-4">
                          <span v-if="post.publishedAt">
                            {{ new Date(post.publishedAt).toLocaleDateString('en-UK') }}
                          </span>
                          <span v-else class="text-muted-foreground">Draft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card v-else class="text-center py-12">
              <CardContent>
                <p class="text-muted-foreground mb-4">No posts in this category yet.</p>
                <Button as-child>
                  <Link href="/">Browse All Posts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <footer class="border-t border-border pt-8 mt-12">
            <div class="flex justify-between items-center">
              <Button variant="outline" as-child>
                <Link href="/categories">Back to Categories</Link>
              </Button>

              <div class="text-center">
                <p class="text-muted-foreground text-sm">
                  Explore more categories to discover content!
                </p>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  </App>
</template>
