<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { Pen, Trash } from 'lucide-vue-next'
import App from '@/layouts/app.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
}

interface Auth {
  user: {
    id: number
    fullName: string
    email: string
  } | null
}

const page = usePage<{
  posts: PaginatedPosts
  categories: Category[]
  auth: Auth
}>()

const showCreateForm = ref(false)
const editingPost = ref<Post | null>(null)

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

const isAuthenticated = computed(() => page.props.auth.user !== null)

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
  createForm.post('/posts', {
    onSuccess: () => {
      showCreateForm.value = false
      createForm.reset()
    },
  })
}

function submitEdit() {
  if (!editingPost.value) return

  editForm.put(`/posts/${editingPost.value.slug}`, {
    onSuccess: () => {
      editingPost.value = null
      editForm.reset()
    },
  })
}

function deletePost(slug: string) {
  useForm({}).delete(`/posts/${slug}`)
}
</script>

<template>
  <Head title="Home" />

  <App>
    <div class="min-h-screen bg-background">
      <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Latest Posts</h1>
            <p class="text-muted-foreground mt-1">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
          </div>

          <Button v-if="isAuthenticated" @click="startCreating">Write Post</Button>
        </div>

        <Card v-if="showCreateForm" class="mb-8">
          <CardHeader>
            <div class="flex justify-between items-center">
              <CardTitle>Create New Post</CardTitle>
              <Button variant="ghost" size="icon" @click="cancelCreate">✕</Button>
            </div>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="submitCreate" class="space-y-6">
              <div class="grid gap-3">
                <Label for="create-title">Title</Label>
                <Input
                  id="create-title"
                  v-model="createForm.title"
                  placeholder="Enter post title..."
                  required
                />
                <div v-if="createForm.errors.title" class="text-destructive text-sm">
                  {{ createForm.errors.title }}
                </div>
              </div>

              <div class="grid gap-3">
                <Label for="create-excerpt">Excerpt (Optional)</Label>
                <Textarea
                  id="create-excerpt"
                  v-model="createForm.excerpt"
                  rows="2"
                  placeholder="Brief description of your post..."
                />
                <div v-if="createForm.errors.excerpt" class="text-destructive text-sm">
                  {{ createForm.errors.excerpt }}
                </div>
              </div>

              <div class="grid gap-3">
                <Label for="create-content">Content</Label>
                <Textarea
                  id="create-content"
                  v-model="createForm.content"
                  rows="10"
                  required
                  placeholder="Write your post content..."
                />
                <div v-if="createForm.errors.content" class="text-destructive text-sm">
                  {{ createForm.errors.content }}
                </div>
              </div>

              <div class="grid gap-3">
                <Label for="create-status">Status</Label>
                <Select v-model="createForm.status">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="flex justify-end space-x-3">
                <Button type="button" variant="outline" @click="cancelCreate"> Cancel </Button>
                <Button type="submit" :disabled="createForm.processing">
                  {{ createForm.processing ? 'Creating...' : 'Create Post' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div class="space-y-6">
          <template v-for="post in page.props.posts.data" :key="post.id">
            <Card v-if="editingPost?.id === post.id">
              <CardHeader>
                <div class="flex justify-between items-center">
                  <CardTitle>Edit Post</CardTitle>
                  <Button variant="ghost" size="icon" @click="cancelEdit">✕</Button>
                </div>
              </CardHeader>
              <CardContent>
                <form @submit.prevent="submitEdit" class="space-y-6">
                  <div class="grid gap-3">
                    <Label for="edit-title">Title</Label>
                    <Input id="edit-title" v-model="editForm.title" required />
                    <div v-if="editForm.errors.title" class="text-destructive text-sm">
                      {{ editForm.errors.title }}
                    </div>
                  </div>

                  <div class="grid gap-3">
                    <Label for="edit-excerpt">Excerpt (Optional)</Label>
                    <Textarea id="edit-excerpt" v-model="editForm.excerpt" rows="2" />
                  </div>

                  <div class="grid gap-3">
                    <Label for="edit-content">Content</Label>
                    <Textarea id="edit-content" v-model="editForm.content" rows="8" required />
                    <div v-if="editForm.errors.content" class="text-destructive text-sm">
                      {{ editForm.errors.content }}
                    </div>
                  </div>

                  <div class="grid gap-3">
                    <Label for="edit-status">Status</Label>
                    <Select v-model="editForm.status">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="flex justify-end space-x-3">
                    <Button type="button" variant="outline" @click="cancelEdit"> Cancel </Button>
                    <Button type="submit" :disabled="editForm.processing">
                      {{ editForm.processing ? 'Updating...' : 'Update Post' }}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card v-else class="hover:shadow-md transition-shadow">
              <CardContent>
                <div class="flex justify-between items-start">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="category in post.categories"
                      :key="category.id"
                      class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {{ category.name }}
                    </span>
                    <span
                      v-if="post.status === 'draft'"
                      class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      Draft
                    </span>
                  </div>

                  <div
                    v-if="isAuthenticated && page.props.auth.user.id === post.user.id"
                    class="flex space-x-2"
                  >
                    <Button variant="ghost" size="icon" @click="startEditing(post)">
                      <Pen />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="text-destructive hover:text-destructive"
                        >
                          <Trash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your post and
                            remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction @click="deletePost(post.slug)">
                            Delete Post
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <h2 class="text-2xl font-bold text-foreground mb-3">
                  <Link :href="`/p/${post.slug}`" class="hover:text-primary transition-colors">
                    {{ post.title }}
                  </Link>
                </h2>

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
                      {{ new Date(post.publishedAt).toLocaleDateString() }}
                    </span>
                    <span v-else class="text-muted-foreground"> Not published </span>
                    <Link :href="`/p/${post.slug}`" class="text-primary hover:underline">
                      Read more →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </template>
        </div>

        <div
          v-if="page.props.posts.meta.lastPage > 1"
          class="mt-8 flex justify-center items-center space-x-2"
        >
          <Button v-if="page.props.posts.meta.currentPage > 1" variant="outline" as-child>
            <Link :href="`/?page=${page.props.posts.meta.currentPage - 1}`"> ← Previous </Link>
          </Button>

          <template v-for="pageNum in page.props.posts.meta.lastPage" :key="pageNum">
            <Button
              v-if="
                Math.abs(pageNum - page.props.posts.meta.currentPage) <= 2 ||
                pageNum === 1 ||
                pageNum === page.props.posts.meta.lastPage
              "
              :variant="pageNum === page.props.posts.meta.currentPage ? 'default' : 'outline'"
              as-child
            >
              <Link :href="`/?page=${pageNum}`">
                {{ pageNum }}
              </Link>
            </Button>
            <span
              v-else-if="Math.abs(pageNum - page.props.posts.meta.currentPage) === 3"
              class="px-3 py-2 text-muted-foreground"
            >
              ...
            </span>
          </template>

          <Button
            v-if="page.props.posts.meta.currentPage < page.props.posts.meta.lastPage"
            variant="outline"
            as-child
          >
            <Link :href="`/?page=${page.props.posts.meta.currentPage + 1}`"> Next → </Link>
          </Button>
        </div>

        <Card v-if="page.props.posts.data.length === 0" class="text-center py-12">
          <CardContent class="pt-6">
            <div class="text-muted-foreground mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <CardTitle class="mb-2">No posts yet</CardTitle>
            <CardDescription class="mb-4">
              Get started by creating your first blog post.
            </CardDescription>
            <Button v-if="isAuthenticated" @click="startCreating"> Create Your First Post </Button>
            <Button v-else as-child>
              <Link href="/register"> Sign up to create posts </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  </App>
</template>
