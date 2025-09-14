<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'

import { useAccountsStore } from '@/stores/accounts'

import AccountsFormRow from './AccountsFormRow.vue'

const accountsStore = useAccountsStore()
const { accounts } = storeToRefs(accountsStore)

onMounted(() => {
  accountsStore.loadFromStorage()

  if (accounts.value.length === 0) {
    accountsStore.addAccount()
  }
})
</script>

<template>
  <Toolbar>
    <template #start>
      <i class="pi pi-question-circle" />
      <span>
        Для указания нескольких меток для одной пары логин/пароль используйте разделитель
        <code>;</code>
      </span>
    </template>

    <template #end>
      <Button icon="pi pi-plus" label="Добавить" @click="accountsStore.addAccount()" />
    </template>
  </Toolbar>
  <div class="form-container">
    <span class="form-label">Метки</span>
    <span class="form-label">Тип записи</span>
    <span class="form-label">Логин</span>
    <span class="form-label">Пароль</span>
    <span class="form-label" />
    <AccountsFormRow
      v-for="(acc, idx) in accounts"
      :key="idx"
      :idx="idx"
      :data="acc"
      @update:data="accounts[idx] = $event"
      @remove="accountsStore.removeAccount(idx)"
    />
  </div>
</template>

<style scoped>
.pi-question-circle {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}

.p-toolbar {
  margin-bottom: 1rem;
}

code {
  margin: 0 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--p-surface-200);
  border-radius: 0.25rem;
}

.form-container {
  display: grid;
  gap: 0.5rem 1rem;
  align-items: center;
}

.form-label {
  display: none;
  color: var(--p-surface-500);
  font-weight: 500;
}

@media (prefers-color-scheme: dark) {
  code {
    background-color: var(--p-surface-700);
  }

  .form-label {
    color: var(--p-surface-400);
  }
}

@media (min-width: 1024px) {
  .form-label {
    display: unset;
  }

  .form-container {
    grid-template-columns: repeat(4, 1fr) 48px;
  }
}
</style>
