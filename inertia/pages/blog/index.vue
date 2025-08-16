<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  user: {
    fullName: string
    email: string
  }
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
}

interface PaginatedPosts {
  data: Post[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

defineProps<{
  posts: PaginatedPosts
}>()
</script>

<template>
  <Head title="Blog" />

  <div class="min-h-screen bg-sand-1">
    <header class="bg-white border-b border-sand-7">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-sand-12">Blog</h1>
          <Link
            href="/blog/create"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Write Post
          </Link>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-8">
      <div class="space-y-8">
        <article
          v-for="post in posts.data"
          :key="post.id"
          class="bg-white border border-sand-7 rounded-lg p-6 hover:shadow-sm transition"
        >
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="category in post.categories"
              :key="category.id"
              class="text-xs px-2 py-1 bg-sand-3 text-sand-11 rounded"
            >
              {{ category.name }}
            </span>
          </div>

          <h2 class="text-2xl font-bold text-sand-12 mb-4">
            <Link :href="`/blog/post/${post.slug}`" class="hover:text-primary transition">
              {{ post.title }}
            </Link>
          </h2>

          <p v-if="post.excerpt" class="text-sand-11 mb-4">
            {{ post.excerpt }}
          </p>

          <div class="flex items-center justify-between text-sm text-sand-10">
            <span>By {{ post.user.fullName || post.user.email }}</span>
            <span>{{ new Date(post.publishedAt).toLocaleDateString() }}</span>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="posts.meta.last_page > 1" class="mt-8 flex justify-center space-x-2">
        <Link
          v-for="page in posts.meta.last_page"
          :key="page"
          :href="`/blog?page=${page}`"
          :class="[
            'px-3 py-2 rounded',
            page === posts.meta.current_page
              ? 'bg-primary text-white'
              : 'bg-white border border-sand-7 text-sand-12 hover:bg-sand-2',
          ]"
        >
          {{ page }}
        </Link>
      </div>
    </main>
  </div>
</template>
