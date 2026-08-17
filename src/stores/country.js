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
    const geographyByCountry = ref({})

    async function fetchCountries(params = {}) {
      loading.value = true
      error.value = null

      try {
        const response = await api.get('/countries', { params })
        setCountries(response.data)
        return response.data
      } catch (requestError) {
        error.value =
          requestError.response?.data?.message || 'An error occurred while fetching countries'
        showToast.error(error.value)
        throw requestError
      } finally {
        loading.value = false
      }
    }

    function setCountries(data) {
      const candidates = [
        data?.data?.countries?.data,
        data?.data?.countries,
        data?.countries?.data,
        data?.countries,
        data?.data,
        data,
      ]
      countries.value = candidates.find(Array.isArray) ?? []
    }

    async function fetchGeographyOptions(countryUuid, { refresh = false } = {}) {
      if (!refresh && geographyByCountry.value[countryUuid]) {
        return geographyByCountry.value[countryUuid]
      }

      const response = await api.get(`/geography/countries/${countryUuid}/options`)
      const options = response.data?.data ?? {
        regions: [],
        districts: [],
        cities: [],
        postal_codes: [],
      }

      geographyByCountry.value = {
        ...geographyByCountry.value,
        [countryUuid]: options,
      }

      return options
    }

    function invalidateGeography(countryUuid) {
      const cache = { ...geographyByCountry.value }
      delete cache[countryUuid]
      geographyByCountry.value = cache
    }

    return {
      countries,
      geographyByCountry,
      fetchCountries,
      fetchGeographyOptions,
      invalidateGeography,
      loading,
      error,
    }
  },
  {
    persist: {
      key: 'gsag-data',
      storage: localStorage,
      paths: ['countries', 'geographyByCountry'],
    },
  },
)
