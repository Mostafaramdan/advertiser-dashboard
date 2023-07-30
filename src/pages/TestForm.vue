<script setup lang="ts">
const initialValues = {
  name: '',
  age: '',
  message: '',
  singleCountry: null,
  multipleCountry: [],
  singleCountryWithSearch: null,
  multipleCountryWithSearch: [],
  radio: null,
  checkbox: [],
  date: null,
  time: null,
  file: null,
}

const formData = reactive({ ...initialValues })

const options: any = [
  {
    text: 'Florida',
    value: 'FL',
  },
  {
    text: 'Georgia',
    value: 'GA',
  },
  {
    text: 'Nebraska',
    value: 'NE',
  },
  {
    text: 'California',
    value: 'CA',
  },
  {
    text: 'New York',
    value: 'NY',
  },
]

const submit = (values: any) => {
  console.log(values)
}
</script>

<template>
  {{ formData }}
  <VCard class="pa-5">
    <VeeForm
      v-slot="{ resetForm }"
      :initial-values="{ ...initialValues }"
      @submit="submit"
    >
      <VRow>
        <VCol cols="12">
          <AppUploadFile v-model="formData.file" name="file" label="File" rules="required" />
        </VCol>
        <VCol cols="12" md="6">
          <AppTextField
            v-model="formData.name"
            name="name"
            label="Name"
            rules="required|min:3"
          />
        </VCol>

        <VCol cols="12" md="6">
          <AppTextField
            v-model="formData.age"
            name="age"
            label="Age"
            rules="required|numeric|min_value:1|max_value:20"
            type="number"
          />
        </VCol>

        <VCol cols="12" md="6">
          <AppSelect
            v-model="formData.singleCountry"
            :items="options"
            item-title="text"
            item-value="value"
            name="singleCountry"
            label="Single Country"
            clearable
            rules="required"
          />
        </VCol>

        <VCol cols="12" md="6">
          <AppSelect
            v-model="formData.multipleCountry"
            :items="options"
            item-title="text"
            item-value="value"
            name="multipleCountry"
            label="Multi Country"
            clearable
            rules="required"
            multiple
            chips
          />
        </VCol>

        <VCol cols="12" md="6">
          <AppAutocomplete
            v-model="formData.singleCountryWithSearch"
            :items="options"
            item-title="text"
            item-value="value"
            name="singleCountryWithSearch"
            label="Single Country With search"
            clearable
            rules="required"
          />
        </VCol>

        <VCol cols="12" md="6">
          <AppAutocomplete
            v-model="formData.multipleCountryWithSearch"
            :items="options"
            item-title="text"
            item-value="value"
            name="multipleCountryWithSearch"
            label="Multi Country With search"
            clearable
            rules="required"
            multiple
            chips
          />
        </VCol>

        <VCol cols="12" md="6">
          <VeeField
            v-slot="{ errorMessage, value, handleChange }"
            v-model="formData.date"
            name="date"
            label="Date"
            rules="required"
          >
            <AppDateTimePicker
              label="Date"
              :model-value="value"
              :error-msg="errorMessage"
              clearable
              prepend-inner-icon="tabler-calendar"
              :config="{ minDate: new Date() }"
              @update:model-value="handleChange"
            />
          </VeeField>
        </VCol>

        <VCol cols="12" md="6">
          <VeeField
            v-slot="{ errorMessage, value, handleChange }"
            v-model="formData.time"
            name="time"
            label="Time"
            rules="required"
          >
            <AppDateTimePicker
              label="Time"
              :model-value="value"
              :error-msg="errorMessage"
              clearable
              prepend-inner-icon="tabler-clock"
              :config="{ enableTime: true, noCalendar: true, dateFormat: 'G:i:K' }"
              @update:model-value="handleChange"
            />
          </VeeField>
        </VCol>

        <VCol cols="12">
          <AppTextarea
            v-model="formData.message"
            name="message"
            label="Message"
            rules="required|min:5|max:50"
            rows="2"
          />
        </VCol>

        <VCol cols="12">
          <AppRadio
            v-model="formData.radio"
            :options="options"
            name="radio"
            label="radio Group"
            rules="required"
            option-label="text"
            option-value="value"
            inline
          />
        </VCol>

        <VCol cols="12">
          <AppCheckbox
            v-model="formData.checkbox"
            :options="options"
            name="checkbox"
            label="checkbox Group"
            rules="required"
            option-label="text"
            option-value="value"
          />
        </VCol>

        <VCol cols="12">
          <!-- :disabled="!meta.valid" -->
          <VBtn type="submit">
            Submit
          </VBtn>
          <VBtn
            class="mx-2"
            variant="outlined"
            @click="resetForm"
          >
            reset
          </VBtn>
        </VCol>
      </VRow>
    </VeeForm>
  </VCard>
</template>
