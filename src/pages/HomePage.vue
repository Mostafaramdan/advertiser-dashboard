<script setup lang="ts">
const step = ref(1)

const { locale } = useI18n()

const formData = reactive({
  name: '',
  email: '',
})

const submit = (values: any) => {
  console.log(values)
}
</script>

<template>
  <div>
    <VCard
      class="mb-6"
      title="منصة المعلنين 🚀"
    >
      <VCardText>لوحة تحكم منصة المعلنين</VCardText>
    </VCard>
  </div>
  <VCard class="pa-5">
    <VeeForm
      v-slot="{ meta, resetForm }"
      @submit="submit"
    >
      {{ formData }} {{ locale }}
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VeeField
            v-slot="{ field, errorMessage }"
            v-model="formData.name"
            name="formData.name"
            label="Name"
            rules="required"
          >
            <VTextField
              v-bind="field"
              :error="!!errorMessage"
              :error-messages="errorMessage"
              type="number"
            />
          </VeeField>
          <div
            v-if="step === 1"
            @click="step++"
          >
            next
          </div>
        </VCol>
        <VCol
          v-if="step === 2"
          cols="12"
          md="6"
        >
          <VeeField
            v-slot="{ field, errorMessage }"
            v-model="formData.email"
            name="formData.email"
            label="Email"
            rules="required|email"
          >
            <VTextField
              v-bind="field"
              :error="!!errorMessage"
              :error-messages="errorMessage"
            />
          </VeeField>
          <div
            v-if="step === 2"
            @click="step--"
          >
            prev
          </div>
        </VCol>

        <VCol cols="12">
          <VBtn
            type="submit"
            :disabled="!meta.valid"
          >
            Submit
          </VBtn>
          <VBtn
            class="mx-2"
            @click="resetForm"
          >
            reset
          </VBtn>
        </VCol>
      </VRow>
    </VeeForm>
  </VCard>
</template>
