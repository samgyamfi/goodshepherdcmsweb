import { computed, reactive, ref } from 'vue'
import { useMembersStore } from '@/stores/members/members'
import { showToast } from '@/utils/toast'

function defaultFormData() {
  return {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    occupation: '',
    whatsapp_number: '',
    address: '',
    digital_address: '',
    country_id: '',
    region_id: '',
    city_id: '',
    postal_code_id: '',
    is_baptized: false,
    baptism_date: '',
    membership_status: 'active',
    membership_date: '',
    groups: [],
    spiritual_gifts: '',
    ministry_interests: '',
    prayer_requests: '',
    privacy_share_contact: true,
    status: 'active',
  }
}

function profileValue(profile, fallback, field, defaultValue = '') {
  return profile?.[field] ?? fallback?.[field] ?? defaultValue
}

function normalizeGroups(member) {
  return (member?.groups ?? [])
    .map((item) => item.group?.id ?? item.id)
    .filter(Boolean)
}

function normalizeMember(member) {
  if (!member) return defaultFormData()

  const profile = member.profile ?? {}
  const personal = member.personal_info ?? {}
  const spiritual = member.spiritual_info ?? {}
  const next = defaultFormData()

  return {
    ...next,
    first_name: member.first_name ?? personal.first_name ?? '',
    last_name: member.last_name ?? personal.last_name ?? '',
    phone: member.phone ?? personal.phone ?? '',
    email: member.email ?? personal.email ?? '',
    date_of_birth: profileValue(profile, personal, 'date_of_birth'),
    gender: profileValue(profile, personal, 'gender'),
    marital_status: profileValue(profile, personal, 'marital_status'),
    occupation: profileValue(profile, personal, 'occupation'),
    whatsapp_number: profileValue(profile, personal, 'whatsapp_number'),
    address: profileValue(profile, personal, 'address'),
    digital_address: profileValue(profile, personal, 'digital_address'),
    country_id: String(profile.country_id ?? personal.country_id ?? ''),
    region_id: String(profile.region_id ?? ''),
    city_id: String(profile.city_id ?? ''),
    postal_code_id: String(profile.postal_code_id ?? ''),
    is_baptized: profile.is_baptized ?? spiritual.is_baptized ?? false,
    baptism_date: profileValue(profile, spiritual, 'baptism_date'),
    membership_status: profile.membership_status ?? spiritual.membership_status ?? 'active',
    membership_date: profileValue(profile, spiritual, 'membership_date'),
    groups: normalizeGroups(member),
    spiritual_gifts: profileValue(profile, spiritual, 'spiritual_gifts'),
    ministry_interests: profileValue(profile, spiritual, 'ministry_interests'),
    prayer_requests: profileValue(profile, spiritual, 'prayer_requests'),
    privacy_share_contact:
      profile.privacy_share_contact ?? spiritual.privacy_share_contact ?? spiritual.share_contact_info ?? true,
    status: member.status ?? 'active',
  }
}

export function useMemberForm(initialData = null, isEditMode = false) {
  const membersStore = useMembersStore()
  const formData = reactive(defaultFormData())
  const errors = ref({})
  const isSubmitting = ref(false)
  const currentMember = ref(initialData)
  const currentEditMode = ref(isEditMode)

  hydrate(initialData, isEditMode)

  const isValid = computed(() => Object.keys(errors.value).length === 0)
  const isFormDirty = computed(() => JSON.stringify(formData) !== JSON.stringify(defaultFormData()))

  const validationRules = {
    first_name: [(value) => !!value || 'First name is required'],
    last_name: [(value) => !!value || 'Last name is required'],
    phone: [(value) => !!value || 'Phone number is required'],
    email: [
      (value) =>
        !value || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid email format',
    ],
    password: [
      (value) => !value || value.length >= 8 || 'Password must be at least 8 characters',
      (value) =>
        !value ||
        /[a-z]/.test(value) ||
        'Password must contain at least one lowercase letter',
      (value) =>
        !value ||
        /[A-Z]/.test(value) ||
        'Password must contain at least one uppercase letter',
      (value) => !value || /\d/.test(value) || 'Password must contain at least one number',
    ],
  }

  function hydrate(member = null, editMode = isEditMode) {
    currentMember.value = member
    currentEditMode.value = editMode
    Object.assign(formData, editMode ? normalizeMember(member) : defaultFormData())
    errors.value = {}
  }

  function validateField(field, value) {
    const rules = validationRules[field]
    if (!rules) return true

    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        errors.value[field] = result
        return false
      }
    }

    delete errors.value[field]
    return true
  }

  function validateForm() {
    errors.value = {}
    let valid = true

    Object.keys(validationRules).forEach((field) => {
      if (!validateField(field, formData[field])) {
        valid = false
      }
    })

    if (formData.password || formData.password_confirmation) {
      if (!formData.password_confirmation) {
        errors.value.password_confirmation = 'Please confirm your password'
        valid = false
      } else if (formData.password !== formData.password_confirmation) {
        errors.value.password_confirmation = 'Passwords do not match'
        valid = false
      }
    }

    return valid
  }

  function handleFieldBlur(field) {
    validateField(field, formData[field])
  }

  function handleFieldInput(field, value) {
    if (errors.value[field]) {
      validateField(field, value)
    }
  }

  async function submitForm() {
    if (!validateForm()) {
      showToast.error('Please fix the form errors')
      return false
    }

    isSubmitting.value = true

    try {
      const submitData = prepareSubmitData()
      const memberUuid = currentMember.value?.uuid
      const success =
        currentEditMode.value && memberUuid
          ? await membersStore.updateMember(memberUuid, submitData)
          : await membersStore.createMember(submitData)

      return Boolean(success)
    } catch (err) {
      console.error('Form submission error:', err)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function prepareSubmitData() {
    const data = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      email: formData.email,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      marital_status: formData.marital_status,
      occupation: formData.occupation,
      whatsapp_number: formData.whatsapp_number,
      address: formData.address,
      digital_address: formData.digital_address,
      country_id: formData.country_id ? Number(formData.country_id) : null,
      region_id: formData.region_id ? Number(formData.region_id) : null,
      city_id: formData.city_id ? Number(formData.city_id) : null,
      postal_code_id: formData.postal_code_id ? Number(formData.postal_code_id) : null,
      is_baptized: formData.is_baptized,
      baptism_date: formData.baptism_date,
      membership_status: formData.membership_status,
      membership_date: formData.membership_date,
      groups: formData.groups.map(Number).filter(Boolean),
      spiritual_gifts: formData.spiritual_gifts,
      ministry_interests: formData.ministry_interests,
      prayer_requests: formData.prayer_requests,
      privacy_share_contact: formData.privacy_share_contact,
      status: formData.status,
    }

    if (formData.password) {
      data.password = formData.password
      data.password_confirmation = formData.password_confirmation
    }

    return data
  }

  function resetForm() {
    Object.assign(formData, defaultFormData())
    errors.value = {}
  }

  function setFormData(member) {
    Object.assign(formData, normalizeMember(member))
    errors.value = {}
  }

  function clearErrors() {
    errors.value = {}
  }

  return {
    formData,
    errors,
    isSubmitting,
    isValid,
    isFormDirty,
    hydrate,
    validateField,
    validateForm,
    handleFieldBlur,
    handleFieldInput,
    submitForm,
    resetForm,
    setFormData,
    clearErrors,
  }
}
