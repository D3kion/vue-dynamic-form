<script lang="ts" setup>
import type z from 'zod'
import { computed, defineProps, defineEmits, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select, { type SelectChangeEvent } from 'primevue/select'
import Password from 'primevue/password'

import { accountSchema, authOptions, type Account } from '@/model/account'

const props = defineProps<{
  idx: number
  data: Account
}>()

const emit = defineEmits<{
  (e: 'update:data', value: typeof props.data): void
  (e: 'remove'): void
  (e: 'blur'): void
}>()

const local = computed({
  get: () => props.data,
  set: (val) => emit('update:data', val),
})

const errors = ref<z.ZodError<Account> | undefined>()

function validate() {
  errors.value = accountSchema.safeParse(local.value).error
  emit('blur')
}

function isInvalid(field: string) {
  return !!errors.value?.issues.find((x) => x.path.includes(field))
}

function onTypeChange(e: SelectChangeEvent) {
  if (e.value === 'ldap') {
    local.value.password = null
  }
}
</script>

<template>
  <InputText
    :name="`accounts[${idx}].tags`"
    v-model="local.tags"
    :invalid="isInvalid('tags')"
    placeholder="Метки"
    fluid
    @blur="validate"
  />
  <Select
    :name="`accounts[${idx}].type`"
    v-model="local.type"
    :invalid="isInvalid('type')"
    :options="authOptions"
    optionLabel="label"
    optionValue="value"
    placeholder="Тип записи"
    fluid
    @blur="validate"
    @change="onTypeChange"
  />
  <InputText
    :class="{ 'grow-2': local.type !== 'plain' }"
    :name="`accounts[${idx}].login`"
    v-model="local.login"
    :invalid="isInvalid('login')"
    placeholder="Логин"
    fluid
    @blur="validate"
  />
  <Password
    v-if="local.type === 'plain'"
    :name="`accounts[${idx}].password`"
    v-model="local.password"
    :invalid="isInvalid('password')"
    placeholder="Пароль"
    toggleMask
    fluid
    @blur="validate"
  />
  <Button icon="pi pi-trash" size="large" text @click="emit('remove')" />
  <hr />
</template>

<style scoped>
.p-button {
  width: 100%;
}

@media (min-width: 1024px) {
  hr {
    display: none;
  }

  .grow-2 {
    grid-column: span 2;
  }
}
</style>
