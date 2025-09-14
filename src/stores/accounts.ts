import { z } from 'zod'
import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { accountSchema, accountsFormSchema, type Account } from '@/model/account'

const LOCAL_STORAGE_KEY = 'saved-accounts'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (!(parsed instanceof Array) || !parsed.length) {
          throw new Error('Unknown data format')
        }

        const result = parsed.map((x) => accountSchema.safeDecode(x))
        if (result.every((x) => x.success)) {
          accounts.value = result.map((x) => x.data)
        } else {
          console.warn('Invalid stored form data, using default')
          accounts.value = []
        }
      }
    } catch (error) {
      console.error('Failed to load form data from storage:', error)
      accounts.value = []
    }
  }

  function saveToStorage() {
    const res = accountsFormSchema.safeParse(accounts.value)
    if (!res.success) {
      console.error("Couln't save invalid data", res.error)
      return
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(accounts.value))
    } catch (error) {
      console.error('Failed to save form data to storage:', error)
    }
  }

  function createAccount(): z.infer<typeof accountSchema> {
    return {
      type: 'plain',
      tags: '',
      login: '',
      password: '',
    }
  }

  function addAccount() {
    accounts.value.push(createAccount())
  }

  function removeAccount(idx: number) {
    accounts.value.splice(idx, 1)
    if (!accounts.value.length) addAccount()
  }

  function resetForm() {
    accounts.value = []
  }

  watch(accounts, saveToStorage, { deep: true })

  return {
    accounts,

    loadFromStorage,
    saveToStorage,
    addAccount,
    removeAccount,
    resetForm,
  }
})
