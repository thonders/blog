<script setup lang="ts">
import { computed } from 'vue'
import { Link, useForm, usePage } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  id: number
  fullName: string
  email: string
}

interface Auth {
  user: User | null
}

const page = usePage<{ auth: Auth }>()

const logoutForm = useForm({})

const isAuthenticated = computed(() => page.props.auth.user !== null)

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
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="relative h-10 w-auto px-3">
                  <div class="flex items-center space-x-2">
                    <Avatar class="h-8 w-8">
                      <AvatarImage :src="undefined" :alt="page.props.auth.user.fullName" />
                      <AvatarFallback class="bg-primary text-primary-foreground text-sm">
                        {{ page.props.auth.user.fullName.charAt(0) }}
                      </AvatarFallback>
                    </Avatar>
                    <span class="text-foreground hidden sm:inline-block">{{
                      page.props.auth.user.fullName
                    }}</span>
                    <svg
                      class="w-4 h-4 text-muted-foreground ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="end" :side-offset="4">
                <DropdownMenuLabel class="font-normal">
                  <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium leading-none">
                      {{ page.props.auth.user.fullName }}
                    </p>
                    <p class="text-xs leading-none text-muted-foreground">
                      {{ page.props.auth.user.email }}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem as-child>
                  <Link href="/" class="cursor-pointer">
                    <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m8 5 4-3 4 3"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <Link href="/profile" class="cursor-pointer">
                    <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <Link href="/settings" class="cursor-pointer">
                    <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout" class="cursor-pointer">
                  <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
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
