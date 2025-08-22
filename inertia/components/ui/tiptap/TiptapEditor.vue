<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import Typography from '@tiptap/extension-typography'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  placeholder?: string
  class?: string
  editable?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Start writing...',
  editable: true,
  limit: 5000,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = ref<Editor>()

editor.value = new Editor({
  content: props.modelValue,
  editable: props.editable,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    CharacterCount.configure({
      limit: props.limit,
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline',
      },
    }),
    Typography,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value)
    }
  }
)

watch(
  () => props.editable,
  (editable) => {
    editor.value?.setEditable(editable)
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const setLink = () => {
  const url = window.prompt('Enter URL:')
  if (url && editor.value) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}

const unsetLink = () => {
  editor.value?.chain().focus().unsetLink().run()
}
</script>

<template>
  <div
    :class="
      cn(
        'border border-input rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        props.class
      )
    "
  >
    <div v-if="editable" class="border-b border-border p-2 flex flex-wrap items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'bg-accent': editor?.isActive('bold') }"
        class="h-8 w-8"
      >
        <Bold class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'bg-accent': editor?.isActive('italic') }"
        class="h-8 w-8"
      >
        <Italic class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleStrike().run()"
        :class="{ 'bg-accent': editor?.isActive('strike') }"
        class="h-8 w-8"
      >
        <Strikethrough class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleCode().run()"
        :class="{ 'bg-accent': editor?.isActive('code') }"
        class="h-8 w-8"
      >
        <Code class="h-4 w-4" />
      </Button>

      <div class="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-accent': editor?.isActive('heading', { level: 1 }) }"
        class="h-8 w-8"
      >
        <Heading1 class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-accent': editor?.isActive('heading', { level: 2 }) }"
        class="h-8 w-8"
      >
        <Heading2 class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-accent': editor?.isActive('heading', { level: 3 }) }"
        class="h-8 w-8"
      >
        <Heading3 class="h-4 w-4" />
      </Button>

      <div class="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-accent': editor?.isActive('bulletList') }"
        class="h-8 w-8"
      >
        <List class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-accent': editor?.isActive('orderedList') }"
        class="h-8 w-8"
      >
        <ListOrdered class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-accent': editor?.isActive('blockquote') }"
        class="h-8 w-8"
      >
        <Quote class="h-4 w-4" />
      </Button>

      <div class="w-px h-6 bg-border mx-1" />

      <Button
        v-if="editor?.isActive('link')"
        variant="ghost"
        size="icon"
        type="button"
        @click="unsetLink"
        class="h-8 w-8 bg-accent"
      >
        <LinkIcon class="h-4 w-4" />
      </Button>
      <Button v-else variant="ghost" size="icon" type="button" @click="setLink" class="h-8 w-8">
        <LinkIcon class="h-4 w-4" />
      </Button>

      <div class="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().undo().run()"
        :disabled="!editor?.can().undo()"
        class="h-8 w-8"
      >
        <Undo class="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        @click="editor?.chain().focus().redo().run()"
        :disabled="!editor?.can().redo()"
        class="h-8 w-8"
      >
        <Redo class="h-4 w-4" />
      </Button>
    </div>

    <div class="p-3 min-h-[200px]">
      <EditorContent :editor="editor" class="tiptap-content" />
    </div>

    <div
      v-if="editable && editor?.storage.characterCount"
      class="px-3 py-2 border-t border-border text-xs text-muted-foreground text-right"
    >
      {{ editor.storage.characterCount.characters() }}/{{ limit }} characters
    </div>
  </div>
</template>

<style scoped>
.tiptap-content :deep(.ProseMirror) {
  outline: none;
  min-height: 150px;
}

.tiptap-content :deep(.ProseMirror h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.tiptap-content :deep(.ProseMirror h2) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.tiptap-content :deep(.ProseMirror h3) {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.tiptap-content :deep(.ProseMirror p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.tiptap-content :deep(.ProseMirror ul) {
  list-style-type: disc;
  list-style-position: outside;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
}

.tiptap-content :deep(.ProseMirror ol) {
  list-style-type: decimal;
  list-style-position: outside;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
}

.tiptap-content :deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

.tiptap-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid var(--color-border);
  padding-left: 1rem;
  font-style: italic;
  color: var(--color-muted-foreground);
  margin-bottom: 0.75rem;
}

.tiptap-content :deep(.ProseMirror code) {
  background-color: var(--color-muted);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}

.tiptap-content :deep(.ProseMirror pre) {
  background-color: var(--color-muted);
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
  overflow-x: auto;
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}

.tiptap-content :deep(.ProseMirror pre code) {
  background-color: transparent;
  padding: 0;
}

.tiptap-content :deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 1.5rem 0;
}

.tiptap-content :deep(.ProseMirror a) {
  color: var(--color-primary);
  text-decoration: underline;
}

.tiptap-content :deep(.ProseMirror a:hover) {
  opacity: 0.8;
}

.tiptap-content :deep(.ProseMirror .is-empty::before) {
  content: attr(data-placeholder);
  color: var(--color-muted-foreground);
  pointer-events: none;
  float: left;
  height: 0;
}

.tiptap-content :deep(.ProseMirror:focus) {
  outline: none;
}

.tiptap-content :deep(.ProseMirror ul[data-type='bulletList']) {
  list-style-type: disc;
  list-style-position: outside;
  padding-left: 1.5rem;
}

.tiptap-content :deep(.ProseMirror ol[data-type='orderedList']) {
  list-style-type: decimal;
  list-style-position: outside;
  padding-left: 1.5rem;
}

.tiptap-content :deep(.ProseMirror ul[data-type='bulletList'] li),
.tiptap-content :deep(.ProseMirror ol[data-type='orderedList'] li) {
  list-style: inherit;
  margin-bottom: 0.25rem;
}

.tiptap-content :deep(.ProseMirror ul ul),
.tiptap-content :deep(.ProseMirror ol ol) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>
