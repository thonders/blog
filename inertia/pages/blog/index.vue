<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  status: string
  user: {
    id: number
    fullName: string
    email: string
  }
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
}

interface Category {
  id: number
  name: string
  slug: string
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

interface Auth {
  user: {
    id: number
    fullName: string
    email: string
  } | null
}

const props = defineProps<{
  posts: PaginatedPosts
  categories: Category[]
  auth: Auth
}>()

const showCreateForm = ref(false)
const editingPost = ref<Post | null>(null)
const showUserMenu = ref(false)

const createForm = useForm({
  title: '',
  content: '',
  excerpt: '',
  status: 'draft' as 'draft' | 'published',
  categoryIds: [] as number[],
})

const editForm = useForm({
  title: '',
  content: '',
  excerpt: '',
  status: 'draft' as 'draft' | 'published',
  categoryIds: [] as number[],
})

const logoutForm = useForm({})

const isAuthenticated = computed(() => props.auth.user !== null)

function startCreating() {
  showCreateForm.value = true
  createForm.reset()
}

function startEditing(post: Post) {
  editingPost.value = post
  editForm.title = post.title
  editForm.content = post.content
  editForm.excerpt = post.excerpt || ''
  editForm.status = post.status as 'draft' | 'published'
  editForm.categoryIds = post.categories.map((cat) => cat.id)
}

function cancelCreate() {
  showCreateForm.value = false
  createForm.reset()
}

function cancelEdit() {
  editingPost.value = null
  editForm.reset()
}

function submitCreate() {
  createForm.post('/blog/posts', {
    onSuccess: () => {
      showCreateForm.value = false
      createForm.reset()
    },
  })
}

function submitEdit() {
  if (!editingPost.value) return

  editForm.put(`/blog/posts/${editingPost.value.slug}`, {
    onSuccess: () => {
      editingPost.value = null
      editForm.reset()
    },
  })
}

function deletePost(slug: string) {
  if (confirm('Are you sure you want to delete this post?')) {
    useForm({}).delete(`/blog/posts/${slug}`)
  }
}

function logout() {
  logoutForm.post('/logout')
}
</script>

<template>
  <Head title="Blog" />

  <div class="min-h-screen bg-sand-1">
    <header class="bg-white border-b border-sand-7">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-sand-12">Blog</h1>

          <div v-if="isAuthenticated" class="flex items-center space-x-4">
            <button
              @click="startCreating"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Write Post
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 bg-sand-2 hover:bg-sand-3 px-3 py-2 rounded-lg transition"
              >
                <div
                  class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium"
                >
                  {{ auth.user?.fullName?.charAt(0) || auth.user?.email.charAt(0) }}
                </div>
                <span class="text-sand-12">{{ auth.user?.fullName || auth.user?.email }}</span>
                <svg class="w-4 h-4 text-sand-10" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white border border-sand-7 rounded-lg shadow-lg py-1"
              >
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-sand-12 hover:bg-sand-2 transition"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <div v-else class="flex space-x-3">
            <Link
              href="/login"
              class="bg-sand-7 text-sand-12 px-4 py-2 rounded-lg hover:bg-sand-8 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-8">
      <!-- Create Form -->
      <div v-if="showCreateForm" class="bg-white border border-sand-7 rounded-lg p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-sand-12">Create New Post</h2>
          <button @click="cancelCreate" class="text-sand-10 hover:text-sand-12 transition">
            ✕
          </button>
        </div>

        <form @submit.prevent="submitCreate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-sand-12 mb-2">Title</label>
            <input
              v-model="createForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Enter post title..."
            />
            <div v-if="createForm.errors.title" class="text-red-500 text-sm mt-1">
              {{ createForm.errors.title }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-sand-12 mb-2">Excerpt (Optional)</label>
            <textarea
              v-model="createForm.excerpt"
              rows="2"
              class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Brief description of your post..."
            ></textarea>
            <div v-if="createForm.errors.excerpt" class="text-red-500 text-sm mt-1">
              {{ createForm.errors.excerpt }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-sand-12 mb-2">Content</label>
            <textarea
              v-model="createForm.content"
              rows="10"
              required
              class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Write your post content..."
            ></textarea>
            <div v-if="createForm.errors.content" class="text-red-500 text-sm mt-1">
              {{ createForm.errors.content }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-sand-12 mb-2">Categories</label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="category in categories"
                :key="category.id"
                class="flex items-center space-x-2 bg-sand-2 px-3 py-1 rounded cursor-pointer hover:bg-sand-3"
              >
                <input
                  v-model="createForm.categoryIds"
                  type="checkbox"
                  :value="category.id"
                  class="text-primary focus:ring-primary"
                />
                <span class="text-sm">{{ category.name }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-sand-12 mb-2">Status</label>
            <select
              v-model="createForm.status"
              class="px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="cancelCreate"
              class="px-4 py-2 text-sand-11 border border-sand-7 rounded-md hover:bg-sand-2 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="createForm.processing"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50"
            >
              {{ createForm.processing ? 'Creating...' : 'Create Post' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Posts List -->
      <div class="space-y-8">
        <article
          v-for="post in posts.data"
          :key="post.id"
          class="bg-white border border-sand-7 rounded-lg p-6 hover:shadow-sm transition"
        >
          <!-- Edit Form -->
          <div v-if="editingPost?.id === post.id" class="space-y-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-sand-12">Edit Post</h3>
              <button @click="cancelEdit" class="text-sand-10 hover:text-sand-12 transition">
                ✕
              </button>
            </div>

            <form @submit.prevent="submitEdit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-sand-12 mb-2">Title</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
                />
                <div v-if="editForm.errors.title" class="text-red-500 text-sm mt-1">
                  {{ editForm.errors.title }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-sand-12 mb-2"
                  >Excerpt (Optional)</label
                >
                <textarea
                  v-model="editForm.excerpt"
                  rows="2"
                  class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-sand-12 mb-2">Content</label>
                <textarea
                  v-model="editForm.content"
                  rows="8"
                  required
                  class="w-full px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
                ></textarea>
                <div v-if="editForm.errors.content" class="text-red-500 text-sm mt-1">
                  {{ editForm.errors.content }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-sand-12 mb-2">Categories</label>
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="category in categories"
                    :key="category.id"
                    class="flex items-center space-x-2 bg-sand-2 px-3 py-1 rounded cursor-pointer hover:bg-sand-3"
                  >
                    <input
                      v-model="editForm.categoryIds"
                      type="checkbox"
                      :value="category.id"
                      class="text-primary focus:ring-primary"
                    />
                    <span class="text-sm">{{ category.name }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-sand-12 mb-2">Status</label>
                <select
                  v-model="editForm.status"
                  class="px-3 py-2 border border-sand-7 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="px-4 py-2 text-sand-11 border border-sand-7 rounded-md hover:bg-sand-2 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="editForm.processing"
                  class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {{ editForm.processing ? 'Updating...' : 'Update Post' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Post Display -->
          <div v-else>
            <div class="flex justify-between items-start mb-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="category in post.categories"
                  :key="category.id"
                  class="text-xs px-2 py-1 bg-sand-3 text-sand-11 rounded"
                >
                  {{ category.name }}
                </span>
                <span
                  v-if="post.status === 'draft'"
                  class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded"
                >
                  Draft
                </span>
              </div>
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
              <div class="flex items-center space-x-4">
                <span v-if="post.publishedAt">
                  {{ new Date(post.publishedAt).toLocaleDateString() }}
                </span>
                <span v-else class="text-yellow-600">Not published</span>
                <div
                  v-if="isAuthenticated && auth.user?.id === post.user.id"
                  class="flex space-x-2"
                >
                  <button
                    @click="startEditing(post)"
                    class="text-primary hover:text-primary/80 transition"
                  >
                    Edit
                  </button>
                  <button
                    @click="deletePost(post.slug)"
                    class="text-red-600 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
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

      <!-- Empty State -->
      <div v-if="posts.data.length === 0" class="text-center py-12">
        <div class="text-sand-10 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-sand-12 mb-2">No posts yet</h3>
        <p class="text-sand-10 mb-4">Get started by creating your first blog post.</p>
        <button
          v-if="isAuthenticated"
          @click="startCreating"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Create Your First Post
        </button>
        <Link
          v-else
          href="/register"
          class="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Sign up to create posts
        </Link>
      </div>
    </main>
  </div>
</template>
