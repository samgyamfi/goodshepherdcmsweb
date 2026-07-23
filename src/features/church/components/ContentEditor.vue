<script setup>
import { ref, watch, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { FileUpload } from '@/components/ui/file-upload'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, Trash2 } from 'lucide-vue-next'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.vue'
import { DatePicker } from '@/components/ui/date-picker'

const props = defineProps({
  section: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  initialData: { type: Object, default: () => ({}) },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['save'])

const uploadedFiles = ref({})

const formData = ref({})
watch(
  () => props.initialData,
  (data) => {
    formData.value = JSON.parse(JSON.stringify(data ?? {}))
    uploadedFiles.value = {}
  },
  { immediate: true, deep: true },
)

// ─── Array item helpers ─────────────────────────────────────────────────────
function addItem(arrayKey, template) {
  if (!Array.isArray(formData.value[arrayKey])) formData.value[arrayKey] = []
  formData.value[arrayKey].push({ ...template })
}

function removeItem(arrayKey, idx) {
  formData.value[arrayKey].splice(idx, 1)
}

function addStringItem(arrayKey) {
  if (!Array.isArray(formData.value[arrayKey])) formData.value[arrayKey] = []
  formData.value[arrayKey].push('')
}

function updateStringItem(arrayKey, idx, value) {
  formData.value[arrayKey][idx] = value
}

// ─── File helpers ───────────────────────────────────────────────────────────
function handleFileSelect(key, file) {
  uploadedFiles.value[key] = file
}

// ─── Section-specific computed ──────────────────────────────────────────────
const beliefs = computed(() =>
  Array.isArray(formData.value.beliefs) ? formData.value.beliefs : [],
)
const values = computed(() => (Array.isArray(formData.value.values) ? formData.value.values : []))
const ministryItems = computed(() =>
  Array.isArray(formData.value.items) ? formData.value.items : [],
)
const newsItems = computed(() => (Array.isArray(formData.value.items) ? formData.value.items : []))

// ─── Submit ─────────────────────────────────────────────────────────────────
function handleSave() {
  emit('save', {
    section: props.section,
    content: formData.value,
    files: uploadedFiles.value,
  })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription v-if="description">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- ─── HERO ────────────────────────────────────────────────────── -->
      <template v-if="section === 'hero'">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Background Image</Label>
            <FileUpload
              :model-value="uploadedFiles.background_image"
              label="Upload Background Image"
              description="Recommended 1920×1080px, max 5MB"
              accept="image/*"
              :max-size="5"
              @change="(file) => handleFileSelect('background_image', file)"
            />
          </div>
          <Separator />
          <div class="grid gap-4">
            <div class="space-y-2">
              <Label>Page Title</Label>
              <Input v-model="formData.title" placeholder="Welcome to Our Church" />
            </div>
            <div class="space-y-2">
              <Label>Subtitle</Label>
              <Input v-model="formData.subtitle" placeholder="Join us for worship and community" />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>Verse Reference</Label>
                <Input v-model="formData.verse_reference" placeholder="John 3:16" />
              </div>
              <div class="space-y-2">
                <Label>CTA Button Text</Label>
                <Input v-model="formData.button_text" placeholder="Join Us This Sunday" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Verse Text</Label>
              <Textarea
                v-model="formData.verse_text"
                rows="3"
                placeholder="Enter verse text"
                class="resize-none"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ─── ABOUT ───────────────────────────────────────────────────── -->
      <template v-else-if="section === 'about'">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Section Title</Label>
            <Input v-model="formData.title" placeholder="About Our Church" />
          </div>

          <div class="space-y-2">
            <Label
              >Description
              <span class="text-xs text-muted-foreground ml-1">(supports rich text)</span></Label
            >
            <RichTextEditor
              v-model="formData.description"
              placeholder="A brief introduction to your church — who you are, what you stand for, and the community you serve…"
            />
          </div>

          <Separator />

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label>Vision Statement</Label>
              <RichTextEditor
                v-model="formData.vision"
                placeholder="Your church vision statement…"
                min-height="120px"
              />
            </div>
            <div class="space-y-2">
              <Label>Mission Statement</Label>
              <RichTextEditor
                v-model="formData.mission"
                placeholder="Your church mission statement…"
                min-height="120px"
              />
            </div>
          </div>

          <Separator />

          <!-- Core Values -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-base">Core Values</Label>
              <Button size="sm" variant="outline" @click="addStringItem('values')">
                <Plus class="h-3.5 w-3.5 mr-1" /> Add Value
              </Button>
            </div>
            <div class="space-y-2">
              <div v-for="(val, idx) in values" :key="idx" class="flex items-center gap-2">
                <Input
                  :value="val"
                  placeholder="Core value…"
                  @input="updateStringItem('values', idx, $event.target.value)"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  class="flex-shrink-0 text-destructive hover:text-destructive"
                  @click="removeItem('values', idx)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
              <p v-if="values.length === 0" class="text-sm text-muted-foreground">
                No values added yet.
              </p>
            </div>
          </div>

          <Separator />

          <!-- Core Beliefs -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-base">Core Beliefs</Label>
              <Button size="sm" variant="outline" @click="addStringItem('beliefs')">
                <Plus class="h-3.5 w-3.5 mr-1" /> Add Belief
              </Button>
            </div>
            <div class="space-y-2">
              <div v-for="(belief, idx) in beliefs" :key="idx" class="flex items-center gap-2">
                <Input
                  :value="belief"
                  placeholder="Belief statement…"
                  @input="updateStringItem('beliefs', idx, $event.target.value)"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  class="flex-shrink-0 text-destructive hover:text-destructive"
                  @click="removeItem('beliefs', idx)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
              <p v-if="beliefs.length === 0" class="text-sm text-muted-foreground">
                No beliefs added yet.
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- ─── QUOTE ─────────────────────────────────────────────────── -->
      <template v-else-if="section === 'quote'">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label
              >Background Image
              <Badge variant="outline" class="ml-1 text-xs">Optional</Badge></Label
            >
            <FileUpload
              :model-value="uploadedFiles.background_image"
              label="Upload Background"
              description="Used as overlay behind the verse, max 5MB"
              accept="image/*"
              :max-size="5"
              @change="(file) => handleFileSelect('background_image', file)"
            />
          </div>
          <Separator />
          <div class="space-y-2">
            <Label>Verse Reference</Label>
            <Input v-model="formData.verse_reference" placeholder="e.g. Matthew 7:8" />
          </div>
          <div class="space-y-2">
            <Label>Verse Text</Label>
            <Textarea
              v-model="formData.verse_text"
              rows="4"
              placeholder="Enter the scripture passage…"
              class="resize-none"
            />
          </div>
        </div>
      </template>

      <!-- ─── MINISTRIES ────────────────────────────────────────────── -->
      <template v-else-if="section === 'ministries'">
        <div class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label>Section Title</Label>
              <Input v-model="formData.title" placeholder="Our Ministries" />
            </div>
            <div class="space-y-2">
              <Label>Section Tagline</Label>
              <Input
                v-model="formData.description"
                placeholder="Discover meaningful ways to connect…"
              />
            </div>
          </div>
          <Separator />
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-base">Ministry Items</Label>
              <Button
                size="sm"
                variant="outline"
                @click="addItem('items', { title: '', description: '', image: null, icon: '' })"
              >
                <Plus class="h-3.5 w-3.5 mr-1" /> Add Ministry
              </Button>
            </div>
            <div
              v-for="(item, idx) in ministryItems"
              :key="idx"
              class="rounded-lg border p-4 space-y-3"
            >
              <div class="flex items-center justify-between">
                <Badge variant="secondary">Ministry {{ idx + 1 }}</Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  class="text-destructive hover:text-destructive"
                  @click="removeItem('items', idx)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="space-y-1.5">
                  <Label class="text-xs">Title</Label>
                  <Input v-model="item.title" placeholder="e.g. Youth Ministry" />
                </div>
                <div class="space-y-1.5">
                  <Label class="text-xs"
                    >Icon <Badge variant="outline" class="ml-1 text-xs">Optional</Badge></Label
                  >
                  <Input v-model="item.icon" placeholder="e.g. zap, heart, users" />
                </div>
              </div>
              <div class="space-y-1.5">
                <Label class="text-xs"
                  >Description <span class="text-muted-foreground">(rich text)</span></Label
                >
                <RichTextEditor
                  v-model="item.description"
                  placeholder="Describe this ministry…"
                  min-height="100px"
                />
              </div>
            </div>
            <p v-if="ministryItems.length === 0" class="text-sm text-muted-foreground">
              No ministries added yet. Click "Add Ministry" to get started.
            </p>
          </div>
        </div>
      </template>

      <!-- ─── FEATURED SERMON ───────────────────────────────────────── -->
      <template v-else-if="section === 'featured_sermon'">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Sermon Thumbnail</Label>
            <FileUpload
              :model-value="uploadedFiles.image"
              label="Upload Thumbnail"
              description="Cover image for the featured sermon, max 5MB"
              accept="image/*"
              :max-size="5"
              @change="(file) => handleFileSelect('image', file)"
            />
          </div>
          <Separator />
          <div class="grid gap-4">
            <div class="space-y-2">
              <Label>Sermon Title</Label>
              <Input v-model="formData.title" placeholder="e.g. Walking in Faith" />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>Pastor Name</Label>
                <Input v-model="formData.pastor_name" placeholder="e.g. Rev. Kwame Mensah" />
              </div>
              <div class="space-y-2">
                <Label>Date Preached</Label>
                <DatePicker v-model="formData.date" placeholder="Select sermon date" />
              </div>
            </div>
            <div class="space-y-2">
              <Label
                >Description
                <span class="text-xs text-muted-foreground ml-1">(rich text)</span></Label
              >
              <RichTextEditor
                v-model="formData.description"
                placeholder="A compelling summary of the sermon — scripture references, key points, and the message's impact on the congregation…"
              />
            </div>
            <div class="space-y-2">
              <Label
                >Video URL <Badge variant="outline" class="ml-1 text-xs">Optional</Badge></Label
              >
              <Input
                v-model="formData.video_url"
                type="url"
                placeholder="https://youtube.com/watch?v=…"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ─── NEWS ──────────────────────────────────────────────────── -->
      <template v-else-if="section === 'news'">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Section Title</Label>
            <Input v-model="formData.title" placeholder="News & Announcements" />
          </div>
          <Separator />
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-base">News Items</Label>
              <Button
                size="sm"
                variant="outline"
                @click="
                  addItem('items', { title: '', excerpt: '', date: '', image: null, link: '' })
                "
              >
                <Plus class="h-3.5 w-3.5 mr-1" /> Add News
              </Button>
            </div>
            <div
              v-for="(item, idx) in newsItems"
              :key="idx"
              class="rounded-lg border p-4 space-y-3"
            >
              <div class="flex items-center justify-between">
                <Badge variant="secondary">News {{ idx + 1 }}</Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  class="text-destructive hover:text-destructive"
                  @click="removeItem('items', idx)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="space-y-1.5">
                  <Label class="text-xs">Headline</Label>
                  <Input v-model="item.title" placeholder="News headline…" />
                </div>
                <div class="space-y-1.5">
                  <Label class="text-xs">Date</Label>
                  <DatePicker v-model="item.date" placeholder="Select news date" />
                </div>
              </div>
              <div class="space-y-1.5">
                <Label class="text-xs"
                  >Excerpt <span class="text-muted-foreground">(rich text)</span></Label
                >
                <RichTextEditor
                  v-model="item.excerpt"
                  placeholder="Brief announcement or news summary…"
                  min-height="80px"
                />
              </div>
              <div class="space-y-1.5">
                <Label class="text-xs"
                  >Link <Badge variant="outline" class="ml-1 text-xs">Optional</Badge></Label
                >
                <Input v-model="item.link" type="url" placeholder="https://…" />
              </div>
            </div>
            <p v-if="newsItems.length === 0" class="text-sm text-muted-foreground">
              No news items added yet. Click "Add News" to get started.
            </p>
          </div>
        </div>
      </template>

      <!-- ─── SOCIAL LINKS ──────────────────────────────────────────── -->
      <template v-else-if="section === 'social_links'">
        <div class="space-y-4">
          <div class="grid gap-4">
            <div class="space-y-2">
              <Label>Facebook</Label>
              <Input
                v-model="formData.facebook"
                type="url"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div class="space-y-2">
              <Label>Instagram</Label>
              <Input
                v-model="formData.instagram"
                type="url"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div class="space-y-2">
              <Label>YouTube</Label>
              <Input
                v-model="formData.youtube"
                type="url"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            <div class="space-y-2">
              <Label>X / Twitter</Label>
              <Input v-model="formData.twitter" type="url" placeholder="https://x.com/yourhandle" />
            </div>
            <div class="space-y-2">
              <Label>Website <Badge variant="outline" class="ml-1 text-xs">Optional</Badge></Label>
              <Input v-model="formData.website" type="url" placeholder="https://yourchurch.org" />
            </div>
          </div>
        </div>
      </template>

      <!-- ─── Save ─────────────────────────────────────────────────── -->
      <Separator />
      <div class="flex justify-end">
        <Button :disabled="isSaving" @click="handleSave">
          <Save class="mr-2 h-4 w-4" />
          {{ isSaving ? 'Saving…' : 'Save Changes' }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
