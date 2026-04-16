import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

export const useCountriesStore = defineStore(
  'countries',
  () => {
    // State
    const countries = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchCountries(params = {}) {
      loading.value = true
      try {
        const response = await api.get('/countries', { params })
        setCountries(response.data)
        return response.data
      } catch (error) {
        error.value = error.response?.data?.message || 'An error occurred while fetching countries'
        showToast.error(error.value)
        throw error
      } finally {
        loading.value = false
      }
    }

    function setCountries(data) {
      const countriesData = data?.countries || []
      if (countriesData.data) {
        countries.value = countriesData.data
      } else if (Array.isArray(countriesData)) {
        countries.value = countriesData
      }
    }

    return { countries, fetchCountries, loading, error }
  },
  {
    persist: {
      key: 'gsag-data',
      storage: localStorage,
      paths: ['countries'],
    },
  },
)
