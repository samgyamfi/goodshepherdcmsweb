<script setup>
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Link2Off,
  Undo,
  Redo,
  Quote,
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Start writing…' },
  maxLength: { type: Number, default: null },
  minHeight: { type: String, default: '160px' },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Placeholder.configure({ placeholder: props.placeholder }),
    CharacterCount.configure({ limit: props.maxLength ?? undefined }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none outline-none',
    },
  },
  onUpdate({ editor: e }) {
    emit('update:modelValue', e.getHTML())
  },
})

// Sync external modelValue changes (e.g. when parent resets the form)
watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return
    const current = editor.value.getHTML()
    if (val !== current) {
      editor.value.commands.setContent(val ?? '', false)
    }
  },
)

function setLink() {
  if (!editor.value) return
  const prev = editor.value.getAttributes('link').href ?? ''
  const url = window.prompt('URL', prev)
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<template>
  <div class="rounded-md border border-input bg-background shadow-sm">
    <!-- ── Toolbar ── -->
    <div class="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/40 px-2 py-1.5">
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('bold') }"
        title="Bold (Ctrl+B)"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <Bold class="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('italic') }"
        title="Italic (Ctrl+I)"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <Italic class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-border" />

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('heading', { level: 2 }) }"
        title="Heading 2"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <Heading2 class="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('heading', { level: 3 }) }"
        title="Heading 3"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <Heading3 class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-border" />

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('bulletList') }"
        title="Bullet List"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <List class="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('orderedList') }"
        title="Numbered List"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <ListOrdered class="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('blockquote') }"
        title="Block Quote"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      >
        <Quote class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-border" />

      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-btn--active': editor?.isActive('link') }"
        title="Insert Link"
        @click="setLink"
      >
        <Link2 class="h-3.5 w-3.5" />
      </button>

      <button
        v-if="editor?.isActive('link')"
        type="button"
        class="rte-btn"
        title="Remove Link"
        @click="editor?.chain().focus().unsetLink().run()"
      >
        <Link2Off class="h-3.5 w-3.5" />
      </button>

      <div class="ml-auto flex items-center gap-0.5">
        <button
          type="button"
          class="rte-btn"
          :disabled="!editor?.can().undo()"
          title="Undo (Ctrl+Z)"
          @click="editor?.chain().focus().undo().run()"
        >
          <Undo class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="rte-btn"
          :disabled="!editor?.can().redo()"
          title="Redo (Ctrl+Y)"
          @click="editor?.chain().focus().redo().run()"
        >
          <Redo class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <!-- ── Editor Area ── -->
    <EditorContent
      :editor="editor"
      class="px-3 py-2 text-sm"
      :style="{ minHeight }"
    />

    <!-- ── Character Count ── -->
    <div
      v-if="maxLength"
      class="flex justify-end border-t border-input px-3 py-1 text-xs text-muted-foreground"
    >
      {{ editor?.storage.characterCount.characters() ?? 0 }} / {{ maxLength }}
    </div>
  </div>
</template>

<style scoped>
.rte-btn {
  display: inline-flex;
  height: 1.75rem;
  width: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.125rem;
  color: hsl(var(--muted-foreground));
  transition: color 0.15s ease, background-color 0.15s ease;
}
.rte-btn:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
.rte-btn:disabled {
  pointer-events: none;
  opacity: 0.4;
}
.rte-btn--active {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

/* ── ProseMirror editor area ─────────────────────────────────────── */
:deep(.ProseMirror) {
  outline: none;
}

/* Placeholder */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  pointer-events: none;
  float: left;
  height: 0;
  color: hsl(var(--muted-foreground));
}

:deep(.ProseMirror h2) {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

:deep(.ProseMirror h3) {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
}

/* space-y-0.5 equivalent — gap between adjacent list items */
:deep(.ProseMirror ul li + li),
:deep(.ProseMirror ol li + li) {
  margin-top: 0.125rem;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid hsl(var(--primary) / 0.3);
  padding-left: 1rem;
  font-style: italic;
  color: hsl(var(--muted-foreground));
}

:deep(.ProseMirror a) {
  color: hsl(var(--primary));
  text-decoration: underline;
  text-underline-offset: 2px;
}

:deep(.ProseMirror strong) {
  font-weight: 600;
}
</style>
