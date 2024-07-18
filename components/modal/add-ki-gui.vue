<script lang="ts" setup>

import { OrderService, type Booking, type IOrder } from '~/services/OrderService';
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { HappyTripService } from "~/services/HappyTripService";
import { format } from 'date-fns';
import { CityService } from "~/services/CityService";

const emit = defineEmits(['loading'])
const happytripService = new HappyTripService()
const toast = useToast()
const { parameters, bodyFilter } = useFilter();
const orderService = new OrderService();

const isOpenAdd = defineModel();

const timeout = ref();
const data = reactive({
  service: [],
  city: [],
  tempCity_1: "",
  tempCity_2: "",
  district1: [],
  district2: [],
})



function reverseNumberFormat(formattedNumber?: string): number {
  if (!formattedNumber) return 0
  return formattedNumber.replace(/\,/g, '');
}

function formatNumber(number?: number) {
  if (!number) return 0
  return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

const schema = z.object({
  full_name: z.string({ message: 'Cần nhập dữ liệu' }).min(2, "Vui lòng nhập họ tên"),
  phone: z.string({ message: 'Cần nhập dữ liệu' }).min(9, 'Vui lòng nhập số điện thoại'),
  departure_city: z.string({ message: 'Cần chọn thành phố' }),
  destination_city: z.string({ message: 'Cần chọn thành phố' }),
  departure_dictrict: z.string({ message: 'Cần chọn quận huyện' }),
  destination_dictrict: z.string({ message: 'Cần chọn quận huyện' }),
  destination_address_1: z.string({ message: 'Cần nhập chi tiết địa chỉ' }),
  departure_address_1: z.string({ message: 'Cần nhập chi tiết địa chỉ' })
})

type Schema = z.output<typeof schema>
watch(() => isOpenAdd.value, (value) => {
  if (value == false) {
    resetState()
  }
})

const state = reactive<Partial<IOrder>>({})
const loadingState = reactive({
  preview: false,
  create: false
})
const props = defineProps({
  dataUpdate: {
    type: Object,
  }
})
watch(() => props.dataUpdate, () => {
  state.full_name = props.dataUpdate!.customer?.full_name
  state.note = props.dataUpdate?.note
  state.phone = props.dataUpdate!.customer.phone
  state.date_of_destination = format(new Date(props.dataUpdate?.date_of_destination), "yyyy-MM-dd'T'HH:mm")
  state.price = props.dataUpdate?.price
  state.price_guest = props.dataUpdate?.price_guest
  state.price_system = props.dataUpdate?.price_system
  state.net_profit = props.dataUpdate?.net_profit
  state.note = props.dataUpdate?.note
  state.id_service = props.dataUpdate?.id_service

  state.departure_city = data.city.find(item => item.name == props.dataUpdate?.departure.city).id
  state.destination_city = data.city.find(item => item.name == props.dataUpdate?.destination.city).id

  data.tempCity_1 = data.city.find(item => item.name == props.dataUpdate?.departure.city).id
  data.tempCity_2 = data.city.find(item => item.name == props.dataUpdate?.destination.city).id

  state.departure_dictrict = props.dataUpdate?.departure.district
  state.destination_dictrict = props.dataUpdate?.destination.district

  state.departure_address_1 = props.dataUpdate?.departure.address_1
  state.destination_address_1 = props.dataUpdate?.destination.address_1
})

onMounted(async () => {
  initData()
})
function resetState() {
  state.date_of_destination = format(new Date(), "yyyy-MM-dd'T'HH:mm")
  console.log("🚀 ~ resetState ~  state.date_of_destination :",  state.date_of_destination )
  state.price = 0
  state.price_guest = 0
  state.price_system = 0
  state.net_profit = 0
  state.note = ""
  state.id_service = undefined
  state.departure_city = undefined
  state.destination_city = undefined
  state.departure_dictrict = undefined
  state.destination_dictrict = undefined
  state.destination_address_1 = undefined
  state.departure_address_1 = undefined
}

function onInputAction(e: Event, target: 'price_guest' | 'price') {
  if (target === 'price_guest') {
    state.price_guest = Number(reverseNumberFormat((e.target as HTMLInputElement).value))
  } else if (target === 'price') {
    state.price = Number(reverseNumberFormat((e.target as HTMLInputElement).value))
  }
  clearTimeout(timeout.value)
  timeout.value = setTimeout(prviewOrder, 1000)
}
async function initData() {
  state.date_of_destination = format(new Date(), "yyyy-MM-dd'T'HH:mm")
  const _preData = await happytripService.getListService()
  parameters.fields = "id,name,status"
  const _city = await new CityService().getCityAsync(parameters, bodyFilter)
  //@ts-ignore
  data.city = Array.from(_city).filter((item) => item.status)
  //@ts-ignore
  data.service = Array.from(_preData).map((item: any) => ({ id: item.id, name: item.name })) || []
  if (!props.dataUpdate?.id_service) {
    //@ts-ignore
    data.tempCity_1 = data.city[0].id
    //@ts-ignore
    data.tempCity_2 = data.city[1].id
    //@ts-ignore
    state.id_service = data.service[0].id
  }
}

watch(() => data.tempCity_2, async () => {
  //@ts-ignore
  state.destination_city = data.city.find(item => item.id == data.tempCity_2).name
  if (!props.dataUpdate?.id_service) {
    //@ts-ignore
    state.destination_dictrict = null
  }
  const a2 = await new CityService().getCityDetailAsync(data.tempCity_2)
  //@ts-ignore
  data.district2 = a2.districts.filter(item => item.status)
})

watch(() => data.tempCity_1, async () => {
  //@ts-ignore
  state.departure_city = data.city.find(item => item.id == data.tempCity_1).name
  if (!props.dataUpdate?.id_service) {
    //@ts-ignore
    state.departure_dictrict = null
  }
  const a1 = await new CityService().getCityDetailAsync(data.tempCity_1)
  //@ts-ignore
  data.district1 = a1.districts.filter(item => item.status)
})
watch(() => state.id_service, () => prviewOrder(true))
watch(() => [state.departure_city, state.destination_city, state.departure_dictrict, state.destination_dictrict], () => {
  prviewOrder(true)
})
async function prviewOrder(service?: boolean) {
  if (checkPreview()) {
    const newObject = JSON.parse(JSON.stringify(state)) as IOrder
    if (service) {
      newObject.price = 0
      newObject.price_guest = 0
    }
    try {
      loadingState.preview = true
      const res = await orderService.previewOrderDeposit(newObject)
      const { net_profit, price, price_guest, price_system } = res as IOrder
      state.net_profit = net_profit
      state.price = price
      state.price_guest = price_guest
      state.price_system = price_system
    } catch (error) {
      toast.add({ title: error.data, color: "red", icon: "i-ic-round-error-outline" })
    } finally {
      loadingState.preview = false
    }
  }
}

function checkPreview() {
  if (!state.id_service || !state.departure_city || !state.destination_city || !state.departure_dictrict || !state.destination_dictrict) {
    return false
  }
  return true
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  try {
    loadingState.create = true
    const res = await orderService.createOrderDeposit(event.data)
    toast.add({
      title: "Tạo đơn thành công",
      //@ts-ignore
      description: "Đơn đã được tạo có ID là: " + res.short_id,
      color: 'green',
      icon: 'i-mdi-success-circle-outline'
    })
    emit("loading")
    isOpenAdd.value = false
  } catch (e) {
    toast.add({ title: e.data, color: "red", icon: "i-ic-round-error-outline" })
  } finally {
    loadingState.create = false
  }
}
</script>
<template>
  <UModal prevent-close v-model="isOpenAdd">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <div class="flex mb-2 pb-2 items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Thêm Mới Chuyến
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
          @click="isOpenAdd = false" />
      </div>
      <UForm :schema="schema" :state="state" class="space-y-2" @submit="onSubmit">
        <div class="flex space-x-2">
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Tên Khách Hàng" class="w-6/12" name="full_name">
            <UInput v-model="state.full_name" />
          </UFormGroup>

          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Số điện thoại" class="w-6/12" name="phone">
            <UInput v-model="state.phone" type="text" />
          </UFormGroup>
        </div>
        <div class="flex flex-wrap md:flex-nowrap md:space-y-0 space-y-2 md:space-x-2">
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Ngày đi" class="md:w-6/12 w-full"
            name="date_of_destination">
            <UInput v-model="state.date_of_destination" class="w-full" :min="state.date_of_destination"
              type="datetime-local" />
          </UFormGroup>
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Dịch vụ" class="md:w-6/12 w-full" name="id_service">
            <USelectMenu class="w-full" v-model="state.id_service" :options="data.service" value-attribute="id"
              option-attribute="name" />
          </UFormGroup>
        </div>
        <div class="flex space-x-2">
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Thành phố đón" class="w-6/12" name="destination_city">
            <USelectMenu class="w-full" v-model="data.tempCity_1"
              :options="data.city.filter(item => item.id != data.tempCity_2)" value-attribute="id"
              option-attribute="name" />
          </UFormGroup>
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Quận huyện đón" class="w-6/12" name="departure_dictrict">
            <USelectMenu class="w-full" :options="data.district1" v-model="state.departure_dictrict"
              value-attribute="name" option-attribute="name" />
          </UFormGroup>
        </div>
        <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Chi tiết địa chỉ đón" class="w-full"
          name="destination_address_1">
          <UInput v-model="state.destination_address_1" type="text" />
        </UFormGroup>
        <div class="flex space-x-2">
          <UFormGroup size="xs" label="Thành phố trả" class="w-6/12" name="departure_city">
            <USelectMenu class="w-full" v-model="data.tempCity_2"
              :options="data.city.filter(item => item.id != data.tempCity_1)" value-attribute="id"
              option-attribute="name" />
          </UFormGroup>
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Quận huyện trả" class="w-6/12"
            name="destination_dictrict">
            <USelectMenu class="w-full" v-model="state.destination_dictrict" :options="data.district2"
              value-attribute="name" option-attribute="name" />
          </UFormGroup>
        </div>
        <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Chi tiết địa chỉ trả" class="w-full"
          name="departure_address_1">
          <UInput v-model="state.departure_address_1" type="text" />
        </UFormGroup>
        <div class="flex space-x-2">
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Cước thu khách" class="w-6/12">
            <UInput :loading="loadingState.preview" :disabled="loadingState.preview"
              @input="(e: Event) => onInputAction(e, 'price_guest')" :value="formatNumber(state.price_guest)"
              type="text" />
          </UFormGroup>
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Tài xế nhận" class="w-6/12">
            <UInput :disabled="loadingState.preview" :loading="loadingState.preview"
              @input="(e: Event) => onInputAction(e, 'price')" :value="formatNumber(state.price)" type="text" />
          </UFormGroup>
        </div>
        <div class="flex space-x-2">
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Phí sàn" hint="Không thể sửa" class="w-6/12">
            <UInput disabled :loading="loadingState.preview" :value="formatNumber(state.price_system)" type="text" />
          </UFormGroup>
          <UFormGroup :ui="{ error: 'mt-1' }" size="xs" label="Hoa hồng" hint="Không thể sửa" class="w-6/12">
            <UInput :loading="loadingState.preview" disabled :value="formatNumber(state.net_profit)" type="text" />
          </UFormGroup>
        </div>
        <UFormGroup :ui="{ error: 'mt-1' }" hint="Không bắt buộc" size="xs" label="Ghi chú" class="w-full">
          <UInput v-model="state.note" type="text" />
        </UFormGroup>
        <div class="text-center">
          <UButton type="submit" icon="i-hugeicons-note-add">
            Tạo Chuyến
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<style scoped></style>