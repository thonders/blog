<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Post {
  id: number
  title: string
  slug: string
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

interface Auth {
  user: {
    id: number
    fullName: string
    email: string
  } | null
}

defineProps<{
  post: Post
  auth: Auth
}>()
</script>

<template>
  <Head :title="post.title" />

  <div class="min-h-screen bg-sand-1">
    <header class="bg-white border-b border-sand-7">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <Link href="/" class="text-primary hover:text-primary/80 transition mb-4 inline-block">
          ← Back to Blog
        </Link>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="category in post.categories"
            :key="category.id"
            class="text-xs px-2 py-1 bg-sand-3 text-sand-11 rounded"
          >
            {{ category.name }}
          </span>
        </div>

        <h1 class="text-4xl font-bold text-sand-12 mb-4">
          {{ post.title }}
        </h1>

        <div class="flex items-center justify-between text-sm text-sand-10">
          <span>By {{ post.user.fullName }}</span>
          <div class="flex items-center space-x-4">
            <span>{{ new Date(post.publishedAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-8">
      <article class="bg-white border border-sand-7 rounded-lg p-8">
        <div class="prose prose-sand max-w-none" v-html="post.content"></div>
      </article>
    </main>
  </div>
</template>
