<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { Pen, Trash, Newspaper } from 'lucide-vue-next'
import { useFilter } from 'reka-ui'
import App from '@/layouts/app.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TiptapEditor } from '@/components/ui/tiptap'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'

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
  user: User | null
}

const props = defineProps<{
  posts: PaginatedPosts
  categories: Category[]
  auth: Auth
}>()

const isAuthenticated = computed(() => props.auth.user !== null)

const showCreateForm = ref(false)
const editingPost = ref<Post | null>(null)

const selectedCategories = ref<string[]>([])
const editSelectedCategories = ref<string[]>([])
const open = ref(false)
const editOpen = ref(false)
const searchTerm = ref('')
const editSearchTerm = ref('')

const createForm = useForm({
  title: '',
  content: '',
  excerpt: '',
  status: 'draft' as 'draft' | 'published',
  categoryIds: [] as string[],
})

const editForm = useForm({
  title: '',
  content: '',
  excerpt: '',
  status: 'draft' as 'draft' | 'published',
  categoryIds: [] as string[],
})

const { contains } = useFilter({ sensitivity: 'base' })

const filteredCategories = computed(() => {
  const options = props.categories.filter(
    (category) => !selectedCategories.value.includes(category.name)
  )
  return searchTerm.value
    ? options.filter((category) => contains(category.name, searchTerm.value))
    : options
})

const editFilteredCategories = computed(() => {
  const options = props.categories.filter(
    (category) => !editSelectedCategories.value.includes(category.name)
  )
  return editSearchTerm.value
    ? options.filter((category) => contains(category.name, editSearchTerm.value))
    : options
})

function startCreating() {
  showCreateForm.value = true
  selectedCategories.value = []
  createForm.reset()
}

function startEditing(post: Post) {
  editingPost.value = post
  editForm.title = post.title
  editForm.content = post.content
  editForm.excerpt = post.excerpt || ''
  editForm.status = post.status as 'draft' | 'published'
  editForm.categoryIds = post.categories.map((cat) => cat.id)
  editSelectedCategories.value = post.categories.map((cat) => cat.name)
}

function cancelCreate() {
  showCreateForm.value = false
  selectedCategories.value = []
  createForm.reset()
}

function cancelEdit() {
  editingPost.value = null
  editSelectedCategories.value = []
  editForm.reset()
}

function submitCreate() {
  const categoryIds = props.categories
    .filter((category) => selectedCategories.value.includes(category.name))
    .map((category) => category.id)

  createForm.categoryIds = categoryIds

  createForm.post('/posts', {
    onSuccess: () => {
      showCreateForm.value = false
      selectedCategories.value = []
      createForm.reset()
    },
  })
}

function submitEdit() {
  if (!editingPost.value) return

  const categoryIds = props.categories
    .filter((category) => editSelectedCategories.value.includes(category.name))
    .map((category) => category.id)

  editForm.categoryIds = categoryIds

  editForm.put(`/posts/${editingPost.value.slug}`, {
    onSuccess: () => {
      editingPost.value = null
      editSelectedCategories.value = []
      editForm.reset()
    },
  })
}

function deletePost(slug: string) {
  useForm({}).delete(`/posts/${slug}`)
}
</script>

<template>
  <Head title="Posts">
    <meta
      name="description"
      content="Discover stories, thinking, and expertise from writers on any topic."
    />
    <meta property="og:title" content="Posts" />
    <meta
      property="og:description"
      content="Discover stories, thinking, and expertise from writers on any topic."
    />
  </Head>

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
                  required
                  placeholder="Enter your post title"
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
                  placeholder="Write a brief summary of your post"
                />
                <div v-if="createForm.errors.excerpt" class="text-destructive text-sm">
                  {{ createForm.errors.excerpt }}
                </div>
              </div>

              <div class="grid gap-3">
                <Label for="create-content">Content</Label>
                <TiptapEditor
                  v-model="createForm.content"
                  placeholder="Write your post content..."
                  :limit="10000"
                />
                <div v-if="createForm.errors.content" class="text-destructive text-sm">
                  {{ createForm.errors.content }}
                </div>
              </div>

              <div class="grid gap-3">
                <Label for="create-categories">Categories</Label>
                <Combobox v-model="selectedCategories" v-model:open="open" :ignore-filter="true">
                  <ComboboxAnchor as-child>
                    <TagsInput v-model="selectedCategories" class="px-2 gap-2 w-80">
                      <div class="flex gap-2 flex-wrap items-center">
                        <TagsInputItem v-for="item in selectedCategories" :key="item" :value="item">
                          <TagsInputItemText />
                          <TagsInputItemDelete />
                        </TagsInputItem>
                      </div>

                      <ComboboxInput v-model="searchTerm" as-child>
                        <TagsInputInput
                          placeholder="Category..."
                          class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                          @keydown.enter.prevent
                        />
                      </ComboboxInput>
                    </TagsInput>

                    <ComboboxList>
                      <ComboboxEmpty>No categories found.</ComboboxEmpty>
                      <ComboboxGroup>
                        <ComboboxItem
                          v-for="category in filteredCategories"
                          :key="category.id"
                          :value="category.name"
                          @select.prevent="
                            (ev) => {
                              if (typeof ev.detail.value === 'string') {
                                searchTerm = ''
                                selectedCategories.push(ev.detail.value)
                              }

                              if (filteredCategories.length === 0) {
                                open = false
                              }
                            }
                          "
                        >
                          {{ category.name }}
                        </ComboboxItem>
                      </ComboboxGroup>
                    </ComboboxList>
                  </ComboboxAnchor>
                </Combobox>
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
                <Button type="button" variant="outline" @click="cancelCreate">Cancel</Button>
                <Button type="submit" :disabled="createForm.processing">
                  {{ createForm.processing ? 'Creating...' : 'Create Post' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div class="space-y-6">
          <template v-for="post in props.posts.data" :key="post.id">
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
                    <Input
                      id="edit-title"
                      v-model="editForm.title"
                      required
                      placeholder="Enter your post title"
                    />
                    <div v-if="editForm.errors.title" class="text-destructive text-sm">
                      {{ editForm.errors.title }}
                    </div>
                  </div>

                  <div class="grid gap-3">
                    <Label for="edit-excerpt">Excerpt (Optional)</Label>
                    <Textarea
                      id="edit-excerpt"
                      v-model="editForm.excerpt"
                      rows="2"
                      placeholder="Write a brief summary of your post"
                    />
                  </div>

                  <div class="grid gap-3">
                    <Label for="edit-content">Content</Label>
                    <TiptapEditor
                      v-model="editForm.content"
                      placeholder="Write your post content..."
                      :limit="10000"
                    />
                    <div v-if="editForm.errors.content" class="text-destructive text-sm">
                      {{ editForm.errors.content }}
                    </div>
                  </div>

                  <div class="grid gap-3">
                    <Label for="edit-categories">Categories</Label>
                    <Combobox
                      v-model="editSelectedCategories"
                      v-model:open="editOpen"
                      :ignore-filter="true"
                    >
                      <ComboboxAnchor as-child>
                        <TagsInput v-model="editSelectedCategories" class="px-2 gap-2 w-80">
                          <div class="flex gap-2 flex-wrap items-center">
                            <TagsInputItem
                              v-for="item in editSelectedCategories"
                              :key="item"
                              :value="item"
                            >
                              <TagsInputItemText />
                              <TagsInputItemDelete />
                            </TagsInputItem>
                          </div>

                          <ComboboxInput v-model="editSearchTerm" as-child>
                            <TagsInputInput
                              placeholder="Category..."
                              class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                              @keydown.enter.prevent
                            />
                          </ComboboxInput>
                        </TagsInput>

                        <ComboboxList>
                          <ComboboxEmpty>No categories found.</ComboboxEmpty>
                          <ComboboxGroup>
                            <ComboboxItem
                              v-for="category in editFilteredCategories"
                              :key="category.id"
                              :value="category.name"
                              @select.prevent="
                                (ev) => {
                                  if (typeof ev.detail.value === 'string') {
                                    editSearchTerm = ''
                                    editSelectedCategories.push(ev.detail.value)
                                  }

                                  if (editFilteredCategories.length === 0) {
                                    editOpen = false
                                  }
                                }
                              "
                            >
                              {{ category.name }}
                            </ComboboxItem>
                          </ComboboxGroup>
                        </ComboboxList>
                      </ComboboxAnchor>
                    </Combobox>
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
                    <Button type="button" variant="outline" @click="cancelEdit">Cancel</Button>
                    <Button type="submit" :disabled="editForm.processing">
                      {{ editForm.processing ? 'Updating...' : 'Update Post' }}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card v-else class="hover:shadow-md transition-shadow">
              <CardContent>
                <div class="flex justify-between items-center mb-3">
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
                    v-if="isAuthenticated && props.auth.user?.id === post.user.id"
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
                  <Link
                    :href="`/${post.user.username}/p/${post.slug}`"
                    class="hover:text-primary transition-colors"
                  >
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
                      {{ new Date(post.publishedAt).toLocaleDateString('en-US') }}
                    </span>
                    <span v-else class="text-muted-foreground">Not published</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </template>
        </div>

        <div
          v-if="props.posts.meta.lastPage > 1"
          class="mt-8 flex justify-center items-center space-x-2"
        >
          <Button
            v-if="props.posts.meta.currentPage > 1"
            variant="outline"
            class="w-10 h-10 flex items-center justify-center"
            as-child
          >
            <Link :href="`/?page=${props.posts.meta.currentPage - 1}`"><</Link>
          </Button>

          <template v-for="pageNum in props.posts.meta.lastPage" :key="pageNum">
            <Button
              v-if="
                Math.abs(pageNum - props.posts.meta.currentPage) <= 2 ||
                pageNum === 1 ||
                pageNum === props.posts.meta.lastPage
              "
              :variant="pageNum === props.posts.meta.currentPage ? 'default' : 'outline'"
              class="w-10 h-10 flex items-center justify-center"
              as-child
            >
              <Link :href="`/?page=${pageNum}`">
                {{ pageNum }}
              </Link>
            </Button>
            <span
              v-else-if="Math.abs(pageNum - props.posts.meta.currentPage) === 3"
              class="px-3 py-2 text-muted-foreground"
            >
              ...
            </span>
          </template>

          <Button
            v-if="props.posts.meta.currentPage < props.posts.meta.lastPage"
            variant="outline"
            class="w-10 h-10 flex items-center justify-center"
            as-child
          >
            <Link :href="`/?page=${props.posts.meta.currentPage + 1}`">></Link>
          </Button>
        </div>

        <Card v-if="props.posts.data.length === 0" class="text-center py-12">
          <CardContent class="pt-6">
            <div class="text-muted-foreground mb-4">
              <Newspaper class="size-12 mx-auto" />
            </div>
            <CardTitle class="mb-2">No posts yet</CardTitle>
            <CardDescription class="mb-4">
              Get started by creating your first blog post.
            </CardDescription>
            <Button v-if="isAuthenticated" @click="startCreating">Create Your First Post</Button>
            <Button v-else as-child>
              <Link href="/register">Sign Up to Create Posts</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  </App>
</template>
