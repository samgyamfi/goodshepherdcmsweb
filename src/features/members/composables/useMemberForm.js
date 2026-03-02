import { ref, computed, reactive } from 'vue'
import { useMembersStore } from '@/stores/members/members'
import { showToast } from '@/utils/toast'

/**
 * Composable for member form handling
 * Handles form state, validation, and submission
 */
export function useMemberForm(initialData = null, isEditMode = false) {
  const membersStore = useMembersStore()

  // Form state
  const formData = reactive({
    // Personal Information
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    date_of_birth: null,
    gender: '',
    marital_status: '',
    occupation: '',
    whatsapp_number: '',
    address: '',
    digital_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',

    // Spiritual & Church Info
    is_baptized: false,
    baptism_date: null,
    membership_status: 'active',
    membership_date: null,
    groups: [],
    spiritual_gifts: '',
    ministry_interests: '',
    prayer_requests: '',
    share_contact_info: true,

    // Status
    status: 'active',
  })

  // Validation errors
  const errors = ref({})

  // Loading state
  const isSubmitting = ref(false)

  // Initialize form with data if editing
  if (initialData && isEditMode) {
    Object.keys(formData).forEach((key) => {
      if (initialData[key] !== undefined) {
        formData[key] = initialData[key]
      }
    })

    // Handle nested data if needed
    if (initialData.personal_info) {
      formData.first_name = initialData.personal_info.first_name || ''
      formData.last_name = initialData.personal_info.last_name || ''
      formData.phone = initialData.personal_info.phone || ''
      formData.email = initialData.personal_info.email || ''
      formData.date_of_birth = initialData.personal_info.date_of_birth || null
      formData.gender = initialData.personal_info.gender || ''
      formData.marital_status = initialData.personal_info.marital_status || ''
      formData.occupation = initialData.personal_info.occupation || ''
      formData.whatsapp_number = initialData.personal_info.whatsapp_number || ''
      formData.address = initialData.personal_info.address || ''
      formData.digital_address = initialData.personal_info.digital_address || ''
      formData.city = initialData.personal_info.city || ''
      formData.state = initialData.personal_info.state || ''
      formData.postal_code = initialData.personal_info.postal_code || ''
      formData.country = initialData.personal_info.country || ''
    }

    if (initialData.spiritual_info) {
      formData.is_baptized = initialData.spiritual_info.is_baptized || false
      formData.baptism_date = initialData.spiritual_info.baptism_date || null
      formData.membership_status = initialData.spiritual_info.membership_status || 'active'
      formData.membership_date = initialData.spiritual_info.membership_date || null
      formData.groups = initialData.spiritual_info.groups || []
      formData.spiritual_gifts = initialData.spiritual_info.spiritual_gifts || ''
      formData.ministry_interests = initialData.spiritual_info.ministry_interests || ''
      formData.prayer_requests = initialData.spiritual_info.prayer_requests || ''
      formData.share_contact_info = initialData.spiritual_info.share_contact_info ?? true
    }

    formData.status = initialData.status || 'active'
  }

  // Computed
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const isFormDirty = computed(() => {
    if (!initialData) return false
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  })

  // Validation rules
  const validationRules = {
    first_name: [(v) => !!v || 'First name is required'],
    last_name: [(v) => !!v || 'Last name is required'],
    phone: [(v) => !!v || 'Phone number is required'],
    email: [
      (v) => !!v || 'Email is required',
      (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Invalid email format',
    ],
    password: isEditMode
      ? []
      : [
          (v) => !!v || 'Password is required',
          (v) => !v || v.length >= 6 || 'Password must be at least 6 characters',
        ],
    password_confirmation: isEditMode
      ? []
      : [
          (v) => !!v || 'Please confirm your password',
          (v) => !v || v === formData.password || 'Passwords do not match',
        ],
  }

  // Validate a single field
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

  // Validate all fields
  function validateForm() {
    errors.value = {}
    let isValid = true

    Object.keys(validationRules).forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false
      }
    })

    // Additional cross-field validation
    if (formData.password && formData.password_confirmation) {
      if (formData.password !== formData.password_confirmation) {
        errors.value.password_confirmation = 'Passwords do not match'
        isValid = false
      }
    }

    return isValid
  }

  // Handle field blur
  function handleFieldBlur(field) {
    validateField(field, formData[field])
  }

  // Handle field input
  function handleFieldInput(field, value) {
    if (errors.value[field]) {
      validateField(field, value)
    }
  }

  // Submit form
  async function submitForm() {
    if (!validateForm()) {
      showToast.error('Please fix the form errors')
      return false
    }

    isSubmitting.value = true

    try {
      // Prepare data for API
      const submitData = prepareSubmitData()

      let success
      if (isEditMode && initialData?.uuid) {
        success = await membersStore.updateMember(initialData.uuid, submitData)
      } else {
        success = await membersStore.createMember(submitData)
      }

      if (success) {
        return true
      }

      return false
    } catch (err) {
      console.error('Form submission error:', err)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // Prepare data for API submission
  function prepareSubmitData() {
    const data = {
      // Personal Information
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
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code,
      country: formData.country,

      // Spiritual & Church Info
      is_baptized: formData.is_baptized,
      baptism_date: formData.baptism_date,
      membership_status: formData.membership_status,
      membership_date: formData.membership_date,
      groups: formData.groups,
      spiritual_gifts: formData.spiritual_gifts,
      ministry_interests: formData.ministry_interests,
      prayer_requests: formData.prayer_requests,
      share_contact_info: formData.share_contact_info,

      // Status
      status: formData.status,
    }

    // Only include password fields in create mode or if password is being changed
    if (!isEditMode || formData.password) {
      data.password = formData.password
      data.password_confirmation = formData.password_confirmation
    }

    return data
  }

  // Reset form
  function resetForm() {
    Object.keys(formData).forEach((key) => {
      if (key === 'is_baptized' || key === 'share_contact_info') {
        formData[key] = false
      } else if (key === 'membership_status' || key === 'status') {
        formData[key] = 'active'
      } else if (Array.isArray(formData[key])) {
        formData[key] = []
      } else {
        formData[key] = ''
      }
    })
    errors.value = {}
  }

  // Set form data from member object
  function setFormData(member) {
    Object.keys(formData).forEach((key) => {
      if (member[key] !== undefined) {
        formData[key] = member[key]
      }
    })
  }

  // Clear errors
  function clearErrors() {
    errors.value = {}
  }

  return {
    // State
    formData,
    errors,
    isSubmitting,

    // Computed
    isValid,
    isFormDirty,

    // Actions
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
