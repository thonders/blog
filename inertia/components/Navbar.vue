<script setup lang="ts">
import { ref, computed } from 'vue'
import { Link, useForm, usePage } from '@inertiajs/vue3'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

interface User {
  id: number
  fullName: string
  email: string
}

interface Auth {
  user: User | null
}

const page = usePage<{ auth: Auth }>()

const showUserMenu = ref(false)
const logoutForm = useForm({})

const isAuthenticated = computed(() => page.props.auth.user !== null)

function logout() {
  logoutForm.post('/logout')
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/components/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/components/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/components/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/components/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/components/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/components/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]
</script>

<template>
  <nav class="bg-background border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <Link href="/" class="text-xl font-bold text-foreground hover:text-primary transition">
            Blog
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]"
                  >
                    <li class="row-span-3">
                      <NavigationMenuLink as-child>
                        <Link
                          href="/"
                          class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div class="mb-2 mt-4 text-lg font-medium">Blog Platform</div>
                          <p class="text-sm leading-tight text-muted-foreground">
                            A modern blog platform built with AdonisJS and Vue 3.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink as-child>
                        <Link
                          href="/docs/introduction"
                          class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div class="text-sm font-medium leading-none">Introduction</div>
                          <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn about the platform and its features.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink as-child>
                        <Link
                          href="/docs/installation"
                          class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div class="text-sm font-medium leading-none">Getting Started</div>
                          <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            How to create your first blog post.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink as-child>
                        <Link
                          href="/docs/typography"
                          class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div class="text-sm font-medium leading-none">Writing Guide</div>
                          <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Tips for writing engaging blog posts.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li v-for="component in components" :key="component.title">
                      <NavigationMenuLink as-child>
                        <Link
                          :href="component.href"
                          class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                          <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {{ component.description }}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/docs/introduction" :class="navigationMenuTriggerStyle()">
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 bg-muted hover:bg-accent px-3 py-2 rounded-lg transition"
              >
                <div
                  class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                >
                  {{
                    page.props.auth.user?.fullName?.charAt(0) ||
                    page.props.auth.user?.email.charAt(0)
                  }}
                </div>
                <span class="text-foreground">{{
                  page.props.auth.user?.fullName || page.props.auth.user?.email
                }}</span>
                <svg class="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1"
              >
                <Link
                  href="/profile"
                  class="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  class="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition"
                >
                  Dashboard
                </Link>
                <hr class="my-1 border-border" />
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <Link href="/login">
              <Button variant="ghost" class="text-foreground hover:text-primary"> Login </Button>
            </Link>
            <Link href="/register">
              <Button class="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
