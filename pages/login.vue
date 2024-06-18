<template>
  <div class="w-full bg-custom h-screen flex justify-center items-center">
    <div class="w-96 bg-white shadow p-4 rounded">
      <img src="https://happytrip.vn/img/logohpt.png" class="mx-auto my-2" width="150" alt="">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Quyền truy cập">
          <USelect option-attribute="name" v-model="roleActive" :options="role" />
        </UFormGroup>
        <UFormGroup label="Số điện thoại" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Mật khẩu" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <div class="flex flex-col items-center justify-center">
          <div>
            <UButton type="submit">
              Đăng nhập
            </UButton>
          </div>

          <img src="/assets/images/driver-cuate.svg" class="w-80" alt="">
        </div>
      </UForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
definePageMeta({
  layout: "blank",
})

const role = [
  {
    name: "Tài xế",
    value: "partner"
  },
  {
    name: "Cộng tác viên",
    value: "affilate"
  }
]
const roleActive = ref("partner")
const schema = z.object({
  email: z.string({ message: 'Vui lòng nhập số điện thoại' }).min(9, 'Hãy nhập đúng số điện thoại'),
  password: z.string({ message: "Vui lòng nhập mật khẩu" }).min(6, 'Mật khẩu tối thiểu 6 kí tự')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>

<style>
.bg-custom {
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>