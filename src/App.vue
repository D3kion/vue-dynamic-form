<script lang="ts" setup>
import AccountsForm from './components/AccountsForm.vue'
</script>

<template>
  <header>
    <h1>Учетные записи</h1>
  </header>

  <main>
    <AccountsForm />
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

h1 {
  font-weight: bold;
}
</style>
