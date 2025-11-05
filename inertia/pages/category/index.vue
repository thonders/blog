<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { Pen, Trash, FolderOpen } from 'lucide-vue-next'
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

interface User {
  id: string
  fullName: string
  username: string
  email: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  user: User
}

interface PaginatedCategories {
  data: Category[]
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
  categories: PaginatedCategories
  auth: Auth
}>()

const isAuthenticated = computed(() => props.auth.user !== null)

const showCreateForm = ref(false)
const editingCategory = ref<Category | null>(null)

const createForm = useForm({
  name: '',
  description: '',
})

const editForm = useForm({
  name: '',
  description: '',
})

function startCreating() {
  showCreateForm.value = true
  createForm.reset()
}

function startEditing(category: Category) {
  editingCategory.value = category
  editForm.name = category.name
  editForm.description = category.description || ''
}

function cancelCreate() {
  showCreateForm.value = false
  createForm.reset()
}

function cancelEdit() {
  editingCategory.value = null
  editForm.reset()
}

function submitCreate() {
  createForm.post('/categories', {
    onSuccess: () => {
      showCreateForm.value = false
      createForm.reset()
    },
  })
}

function submitEdit() {
  if (!editingCategory.value) return

  editForm.put(`/categories/${editingCategory.value.slug}`, {
    onSuccess: () => {
      editingCategory.value = null
      editForm.reset()
    },
  })
}

function deleteCategory(slug: string) {
  useForm({}).delete(`/categories/${slug}`)
}
</script>

<template>
  <Head title="Categories">
    <meta name="description" content="Discover categories from various writers." />
    <meta property="og:title" content="Categories" />
    <meta property="og:description" content="Discover categories from various writers." />
  </Head>

  <App>
    <div class="min-h-screen bg-background">
      <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Categories</h1>
            <p class="text-muted-foreground mt-1">Discover categories from various writers.</p>
          </div>

          <Button v-if="isAuthenticated" @click="startCreating">Create Category</Button>
        </div>

        <Card v-if="showCreateForm" class="mb-8">
          <CardHeader>
            <div class="flex justify-between items-center">
              <CardTitle>Create New Category</CardTitle>
              <Button variant="ghost" size="icon" @click="cancelCreate">✕</Button>
            </div>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="submitCreate" class="space-y-6">
              <div class="grid gap-3">
                <Label for="create-name">Name</Label>
                <Input
                  id="create-name"
                  v-model="createForm.name"
                  required
                  placeholder="Enter category name"
                />
                <div v-if="createForm.errors.name" class="text-destructive text-sm">
                  {{ createForm.errors.name }}
                </div>
              </div>

              <div class="grid gap-3">
                <Label for="create-description">Description (Optional)</Label>
                <Textarea
                  id="create-description"
                  v-model="createForm.description"
                  rows="3"
                  placeholder="Describe what this category is about"
                />
                <div v-if="createForm.errors.description" class="text-destructive text-sm">
                  {{ createForm.errors.description }}
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <Button type="button" variant="outline" @click="cancelCreate">Cancel</Button>
                <Button type="submit" :disabled="createForm.processing">
                  {{ createForm.processing ? 'Creating...' : 'Create Category' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div class="space-y-6">
          <template v-for="category in props.categories.data" :key="category.id">
            <Card v-if="editingCategory?.id === category.id">
              <CardHeader>
                <div class="flex justify-between items-center">
                  <CardTitle>Edit Category</CardTitle>
                  <Button variant="ghost" size="icon" @click="cancelEdit">✕</Button>
                </div>
              </CardHeader>
              <CardContent>
                <form @submit.prevent="submitEdit" class="space-y-6">
                  <div class="grid gap-3">
                    <Label for="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      v-model="editForm.name"
                      required
                      placeholder="Enter category name"
                    />
                    <div v-if="editForm.errors.name" class="text-destructive text-sm">
                      {{ editForm.errors.name }}
                    </div>
                  </div>

                  <div class="grid gap-3">
                    <Label for="edit-description">Description (Optional)</Label>
                    <Textarea
                      id="edit-description"
                      v-model="editForm.description"
                      rows="3"
                      placeholder="Describe what this category is about"
                    />
                    <div v-if="editForm.errors.description" class="text-destructive text-sm">
                      {{ editForm.errors.description }}
                    </div>
                  </div>

                  <div class="flex justify-end space-x-3">
                    <Button type="button" variant="outline" @click="cancelEdit">Cancel</Button>
                    <Button type="submit" :disabled="editForm.processing">
                      {{ editForm.processing ? 'Updating...' : 'Update Category' }}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card v-else class="hover:shadow-md transition-shadow">
              <CardContent>
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h2 class="text-xl font-bold text-foreground mb-2">
                      <Link
                        :href="`/${category.user.username}/c/${category.slug}`"
                        class="hover:text-primary transition-colors"
                      >
                        {{ category.name }}
                      </Link>
                    </h2>

                    <p v-if="category.description" class="text-muted-foreground mb-4">
                      {{ category.description }}
                    </p>

                    <div class="flex items-center justify-between text-sm text-muted-foreground">
                      <div class="flex items-center space-x-2">
                        <div
                          class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                        >
                          {{ category.user.fullName.charAt(0) }}
                        </div>
                        <span>{{ category.user.fullName }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="isAuthenticated && props.auth.user?.id === category.user.id"
                    class="flex space-x-2 ml-4"
                  >
                    <Button variant="ghost" size="icon" @click="startEditing(category)">
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
                            This action cannot be undone. This will permanently delete your category
                            and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction @click="deleteCategory(category.slug)">
                            Delete Category
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </template>
        </div>

        <div
          v-if="props.categories.meta.lastPage > 1"
          class="mt-8 flex justify-center items-center space-x-2"
        >
          <Button
            v-if="props.categories.meta.currentPage > 1"
            variant="outline"
            class="w-10 h-10 flex items-center justify-center"
            as-child
          >
            <Link :href="`/categories?page=${props.categories.meta.currentPage - 1}`"><</Link>
          </Button>

          <template v-for="pageNum in props.categories.meta.lastPage" :key="pageNum">
            <Button
              v-if="
                Math.abs(pageNum - props.categories.meta.currentPage) <= 2 ||
                pageNum === 1 ||
                pageNum === props.categories.meta.lastPage
              "
              :variant="pageNum === props.categories.meta.currentPage ? 'default' : 'outline'"
              class="w-10 h-10 flex items-center justify-center"
              as-child
            >
              <Link :href="`/categories?page=${pageNum}`">
                {{ pageNum }}
              </Link>
            </Button>
            <span
              v-else-if="Math.abs(pageNum - props.categories.meta.currentPage) === 3"
              class="px-3 py-2 text-muted-foreground"
            >
              ...
            </span>
          </template>

          <Button
            v-if="props.categories.meta.currentPage < props.categories.meta.lastPage"
            variant="outline"
            class="w-10 h-10 flex items-center justify-center"
            as-child
          >
            <Link :href="`/categories?page=${props.categories.meta.currentPage + 1}`">></Link>
          </Button>
        </div>

        <Card v-if="props.categories.data.length === 0" class="text-center py-12">
          <CardContent class="pt-6">
            <div class="text-muted-foreground mb-4">
              <FolderOpen class="size-12 mx-auto" />
            </div>
            <CardTitle class="mb-2">No categories yet</CardTitle>
            <CardDescription class="mb-4">
              Get started by creating your first category to organize your content.
            </CardDescription>
            <Button v-if="isAuthenticated" @click="startCreating">
              Create Your First Category
            </Button>
            <Button v-else as-child>
              <Link href="/register">Sign Up to Create Categories</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  </App>
</template>
