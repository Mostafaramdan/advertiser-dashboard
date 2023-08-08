<script setup lang="ts">
import { authService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const router = useRouter()
const route = useRoute()
const { setAuthUser } = useAuthStore()
const formRef = ref<any>(null)
const isPasswordVisible = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const redirectPath = route.query.redirect || '/'

console.log(redirectPath)

const formData = reactive({
  email: '',
  password: '',
})

// #endregion

/***************************************
 **** Section Methods Declaration ******
 **************************************/
// #region Methods
function submit() {
  const isValid = formRef.value.validate()
  if (isValid) {
    console.log(formData)
    isLoading.value = true
    authService.login(formData).then((res: any) => {
      setAuthUser(res.data.data)
      router.push({ path: redirectPath as string })
    }).finally(() => {
      isLoading.value = false
    })
  }
}

// #endregion
</script>

<template>
  <div class="pt-1 mb-5">
    <h5 class="text-h5 mb-1">
      مرحبا! 👋🏻
    </h5>
    <p class="mb-0">
      الرجاء تسجيل الدخول
    </p>
  </div>

  <VeeForm
    ref="formRef"
    v-slot="{ meta }"
    @submit="submit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="formData.email"
          label="البريد الإلكتروني"
          placeholder="ادخل البريد الإلكتروني"
          type="email"
          name="email"
          rules="required|min:6|email"
          prepend-inner-icon="tabler-mail"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="formData.password"
          label="كلمة المرور"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
          name="password"
          placeholder="ادخل كلمة المرور"
          rules="required|min:6"
          prepend-inner-icon="tabler-lock"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />

        <div class="d-flex align-center justify-space-between flex-wrap mt-4 mb-4">
          <RouterLink
            :to="{ name: 'forget-password-page' }"
            class="text-primary ms-2 mb-1"
          >
            نسيت كلمة المرور؟
          </RouterLink>
        </div>
        <VBtn
          block
          type="submit"
          :disabled="!meta.valid || isLoading"
          :loading="isLoading"
        >
          تسجيل الدخول
        </VBtn>
      </VCol>
    </VRow>
  </VeeForm>
</template>
