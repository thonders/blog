<script setup lang="ts">
import { computed, ref } from 'vue'
import { Link, useForm, usePage } from '@inertiajs/vue3'
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { ChevronDown, Home, User, Settings, LogOut, Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const mode = useColorMode()
const mobileMenuOpen = ref(false)

interface Auth {
  user: {
    id: string
    fullName: string
    email: string
  } | null
}

const page = usePage<{ auth: Auth }>()

const isAuthenticated = computed(() => page.props.auth.user !== null)

const logoutForm = useForm({})

function logout() {
  logoutForm.post('/logout')
  mobileMenuOpen.value = false
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-background border-b border-border">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <Link
            href="/"
            class="text-xl font-bold text-foreground hover:text-primary transition"
            @click="closeMobileMenu"
          >
            Blog
          </Link>
          <div class="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <Link href="/">Posts</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <Link href="/categories">Categories</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div class="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline">
                <Icon
                  icon="radix-icons:moon"
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Icon
                  icon="radix-icons:sun"
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <template v-if="isAuthenticated">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="relative h-10 w-auto px-3">
                  <div class="flex items-center space-x-2">
                    <Avatar class="h-8 w-8">
                      <AvatarFallback class="bg-primary text-primary-foreground text-sm">
                        {{ page.props.auth.user?.fullName.charAt(0) }}
                      </AvatarFallback>
                    </Avatar>
                    <span class="text-foreground">{{ page.props.auth.user?.fullName }}</span>
                    <ChevronDown class="size-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="end" :side-offset="4">
                <DropdownMenuLabel class="font-normal">
                  <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium leading-none">
                      {{ page.props.auth.user?.fullName }}
                    </p>
                    <p class="text-xs leading-none text-muted-foreground">
                      {{ page.props.auth.user?.email }}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem as-child>
                  <Link href="/" class="cursor-pointer">
                    <Home class="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <Link href="/profile" class="cursor-pointer">
                    <User class="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <Link href="/settings" class="cursor-pointer">
                    <Settings class="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout" class="cursor-pointer">
                  <LogOut class="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </template>

          <template v-else>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </template>
        </div>

        <div class="md:hidden flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="icon">
                <Icon
                  icon="radix-icons:moon"
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Icon
                  icon="radix-icons:sun"
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" @click="mobileMenuOpen = !mobileMenuOpen">
            <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
            <span class="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-border py-4 space-y-3 animate-in slide-in-from-top-2"
      >
        <div class="space-y-1">
          <Link
            href="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
            @click="closeMobileMenu"
          >
            Posts
          </Link>
          <Link
            href="/categories"
            class="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
            @click="closeMobileMenu"
          >
            Categories
          </Link>
        </div>

        <div class="border-t border-border pt-4 space-y-3">
          <template v-if="isAuthenticated">
            <div class="px-3 py-2">
              <div class="flex items-center space-x-3">
                <Avatar class="h-10 w-10">
                  <AvatarFallback class="bg-primary text-primary-foreground">
                    {{ page.props.auth.user?.fullName.charAt(0) }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium">{{ page.props.auth.user?.fullName }}</p>
                  <p class="text-xs text-muted-foreground">{{ page.props.auth.user?.email }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <Link
                href="/"
                class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                @click="closeMobileMenu"
              >
                <Home class="size-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/profile"
                class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                @click="closeMobileMenu"
              >
                <User class="size-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                @click="closeMobileMenu"
              >
                <Settings class="size-5" />
                <span>Settings</span>
              </Link>
              <button
                @click="logout"
                class="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                <LogOut class="size-5" />
                <span>Sign out</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="space-y-2 px-3">
              <Link href="/login" @click="closeMobileMenu" class="block">
                <Button variant="outline" class="w-full">Login</Button>
              </Link>
              <Link href="/register" @click="closeMobileMenu" class="block">
                <Button class="w-full">Sign Up</Button>
              </Link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
