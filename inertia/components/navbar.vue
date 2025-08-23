<script setup lang="ts">
import { computed } from 'vue'
import { Link, useForm, usePage } from '@inertiajs/vue3'
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { ChevronDown, Home, User, Settings, LogOut } from 'lucide-vue-next'
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

interface Auth {
  user: {
    id: number
    fullName: string
    email: string
  } | null
}

const page = usePage<{ auth: Auth }>()

const isAuthenticated = computed(() => page.props.auth.user !== null)

const logoutForm = useForm({})

function logout() {
  logoutForm.post('/logout')
}
</script>

<template>
  <nav class="bg-background border-b border-border">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <Link href="/" class="text-xl font-bold text-foreground hover:text-primary transition">
            Blog
          </Link>
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

        <div class="flex items-center space-x-4">
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
                    <span class="text-foreground hidden sm:inline-block">{{
                      page.props.auth.user?.fullName
                    }}</span>
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
      </div>
    </div>
  </nav>
</template>
