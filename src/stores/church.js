import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChurchStore = defineStore(
  'church',
  () => {
    const church = ref({
      name: 'Good Shepherd Assemblies of God',
      medium_name: 'Good Shepherd A/G',
      short_name: 'GSAG',
      digital_address: 'AS-123-4567',
      address: 'Kronum-Kwapra, Carpentermu',
      city: 'Kumasi',
      state: 'Ashanti',
      zip: '02345',
      country: 'Ghana',
      phone: '+233 54 000 0000',
      email: 'info@goodshepherdaug.org',
      website: 'https://www.goodshepherdaug.org',
      logo: '/ag-logo.png',
      description: 'Good Shepherd A/G is a church that loves Jesus and loves people.',
      about:
        'A spirit-empowered Pentecostal church dedicated to evangelizing the lost, worshiping God, and making disciples of all nations.',
      vision: 'To be a church that loves Jesus and loves people.',
      mission: 'To be a church that loves Jesus and loves people.',
      values: ['Love Jesus', 'Love people', 'Love God'],
      beliefs: [
        'We believe in the Bible',
        'We believe in the Trinity',
        'We believe in the Lord Jesus Christ',
        'We believe in the Holy Spirit',
        'We believe in the resurrection',
        'We believe in the life to come',
      ],
    })

    const services = ref([
      {
        name: 'English Service',
        day: 'Sunday',
        time: '7:00 AM',
      },
      {
        name: 'Twi Service',
        day: 'Sunday',
        time: '10:00 AM',
      },
    ])

    const siteSettings = ref({
      hero_management: {
        verse: {
          reference: 'John 3:16',
          text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        },
        title: 'Bible Engaged, Spirit Empowered, Mission Focused',
        button_text: 'Join Us This Sunday',
        button_link: '#services',
        background_image:
          'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80',
      },
    })

    return {
      church,
      services,
      siteSettings,
    }
  },
  {
    persist: {
      key: 'gsag-cms-data',
      storage: localStorage,
      paths: ['church', 'services', 'siteSettings'],
    },
  },
)
