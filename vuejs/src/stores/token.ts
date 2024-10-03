import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useLocalStorage('unified_to/token', ''),
    connection_id: useLocalStorage('unified_to/connection_id', ''),
    workspace_id: useLocalStorage('unified_to/workspace_id', '')
  })
})
