/**
 * Recursively appends a nested JS object to a FormData instance.
 *
 * Rules:
 * - Primitive values, File, and Date instances are leaf nodes — appended as-is.
 * - null/undefined → appended as empty string (allows clearing optional fields).
 * - Plain objects and arrays are recursed using PHP bracket notation:
 *   e.g. { address: { city: 'Accra' } } → address[city]=Accra
 *
 * Usage:
 *   const fd = new FormData()
 *   buildFormData(fd, { name: 'John', photo: fileObject })
 */
function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else {
    formData.append(parentKey, data == null ? '' : data)
  }
}

export default {
  formatPhoneNumber: (phone) => {
    return phone.replace(/[^0-9]/g, '')
  },
  formatCurrency: (amount) => {
    return amount.toFixed(2)
  },
  formatDate: (date) => {
    return date.toLocaleDateString()
  },
  formatTime: (time) => {
    return time.toLocaleTimeString()
  },
  findItemByID: (ARRAY, ID) => {
    return ARRAY.find((element) => element.id == ID)
  },

  findItemByKey: (ARRAY, key, value) => {
    return ARRAY.find((element) => element[key] == value)
  },

  removeItemByKey: (ARRAY, ID, key = 'id') => {
    const indexToRemove = ARRAY.findIndex((item) => item[key] === ID)
    if (indexToRemove !== -1) {
      ARRAY.splice(indexToRemove, 1)
    }
    return ARRAY
  },

  checkAllItems: (ARRAY, itemsKey, checked, checkedKey) => {
    let items = []
    ARRAY.forEach((y) => (y[checkedKey] = false))
    if (checked) {
      items = ARRAY.map((x) => x[itemsKey])
      ARRAY.forEach((y) => (y[checkedKey] = true))
    }
    return items
  },

  selectAnItem: (ARRAY, item, itemsKey, checked) => {
    if (checked) {
      ARRAY.push(item[itemsKey])
    } else {
      ARRAY = ARRAY.filter((x) => x !== item[itemsKey])
    }
    return ARRAY
  },

  updateItemByKey: (ARRAY, ID, key, value) => {
    const indexToUpdate = ARRAY.findIndex((item) => item[key] === ID)
    if (indexToUpdate !== -1) {
      ARRAY[indexToUpdate][key] = value
    }
    return ARRAY
  },

  deleteInputRow: (ARRAY, item) => {
    let idx = ARRAY.indexOf(item)
    if (idx > -1) {
      return ARRAY.splice(idx, 1)
    }
    return ARRAY
  },

  getInputRowIndex: (ARRAY, item) => {
    return ARRAY.indexOf(item)
  },

  getInputRow: (ARRAY, index) => {
    return ARRAY[index]
  },

  downloadFile: (bufferData, mimeType, fileName) => {
    let blob = new Blob([bufferData], { type: `${mimeType}` })
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `${fileName}`
    link.click()
  },

  bufferToFile: (ARRAYBUFFER, mimeType = 'application/pdf') => {
    let newBlob = new Blob([ARRAYBUFFER], { type: `${mimeType}` })
    const fileLink = window.URL.createObjectURL(newBlob)
    return fileLink
  },

  pushAllItemsIntoArray: (ARRAY_CONTAINER, ARRAY_DATA, KEY_TO_PUSH, isChecked) => {
    ARRAY_CONTAINER = []
    if (isChecked) {
      ARRAY_DATA.forEach((x) => ARRAY_CONTAINER.push(x[KEY_TO_PUSH]))
    }
    return ARRAY_CONTAINER
  },

  isEmptyObject: (obj) => {
    return !obj || (Object.keys(obj)?.length === 0 && obj?.constructor === Object)
  },

  /**
   * Converts a nested JS object (including File instances) into FormData.
   *
   * File/Blob values are passed through as-is; nested objects are serialised
   * using PHP-compatible bracket notation so Laravel can parse them.
   *
   * Example:
   *   jsonToFormData({ name: 'John', photo: fileObj, address: { city: 'Accra' } })
   *   // → FormData { name: 'John', photo: <File>, address[city]: 'Accra' }
   */
  jsonToFormData: (data) => {
    const formData = new FormData()
    buildFormData(formData, data)
    return formData
  },

  buildFormData,
}
