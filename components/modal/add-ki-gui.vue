<script lang="ts" setup>
import type {BodyFilter, Pagination} from '~/model/FilterModal';
import {OrderService, type Booking, type IOrder} from '~/services/OrderService';
import {z} from 'zod'
import type {FormSubmitEvent} from '#ui/types'
import {HappyTripService} from "~/services/HappyTripService";
import {format} from 'date-fns';
import {CityService} from "~/services/CityService";

const happytripService = new HappyTripService()
const toast = useToast()
const user = useUser();
const {parameters, bodyFilter} = useFilter();
const orderService = new OrderService();
const loading = ref(true);
const loadingNhanDon = ref('');
const listOrder = ref<Partial<{ pagination: Pagination, data: Booking[] }>>()
const isOpenAdd = defineModel();
var previewOrder = reactive<Partial<IOrder>>({})
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
  full_name: z.string({message: 'Cần nhập dữ liệu'}).min(2, "Vui lòng nhập họ tên"),
  phone: z.string({message: 'Cần nhập dữ liệu'}).min(9, 'Vui lòng nhập số điện thoại'),
  departure_city: z.string({message: 'Cần chọn thành phố'}),
  destination_city: z.string({message: 'Cần chọn thành phố'}),
  departure_dictrict: z.string({message: 'Cần chọn quận huyện'}),
  destination_dictrict: z.string({message: 'Cần chọn quận huyện'}),
  destination_address_1: z.string({message: 'Cần nhập chi tiết địa chỉ'}),
  departure_address_1: z.string({message: 'Cần nhập chi tiết địa chỉ'})
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<IOrder>>({})
const loadingState = reactive({
  preview: false
})
initFilter()

onMounted(async () => {
  initData()
})

watchEffect(async () => {
  loading.value = true
  await ListOrder(parameters, bodyFilter)
  loading.value = false
})

async function initData() {
  state.date_of_destination = format(new Date(), "yyyy-MM-dd'T'HH:mm")
  const _preData = await happytripService.getListService()
  parameters.fields = "id,name,status"
  const _city = await new CityService().getCityAsync(parameters, bodyFilter)
  //@ts-ignore
  data.city = Array.from(_city).filter((item) => item.status)
  //@ts-ignore
  data.tempCity_1 = data.city[0].id
  //@ts-ignore
  data.tempCity_2 = data.city[1].id
  //@ts-ignore
  data.service = Array.from(_preData).map((item: any) => ({id: item.id, name: item.name})) || []
  //@ts-ignore
  state.id_service = data.service[0].id
}

watchEffect(async () => {
  if (data.tempCity_1) {
    //@ts-ignore
    state.departure_city = data.city.find(item => item.id == data.tempCity_1).name
    //@ts-ignore
    state.departure_dictrict = null
    const a1 = await new CityService().getCityDetailAsync(data.tempCity_1)
    //@ts-ignore
    data.district1 = a1.districts.filter(item => item.status)
  }
  if (data.tempCity_2) {
    //@ts-ignore
    state.destination_city = data.city.find(item => item.id == data.tempCity_2).name
    //@ts-ignore
    state.destination_dictrict = null
    const a2 = await new CityService().getCityDetailAsync(data.tempCity_2)
    //@ts-ignore
    data.district2 = a2.districts.filter(item => item.status)
  }
})

watch(() => [
  state.destination_city,
  state.departure_city,
  state.date_of_destination,
  state.destination_dictrict,
  state.id_service,
  state.departure_dictrict,
  state.price,
  state.price_guest
], (value) => {
  checkData()
}, {deep: true})

function checkData() {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(async () => {
    if (checkIsPreivew(state, ['destination_city', 'departure_city', 'departure_dictrict', 'destination_dictrict', 'id_service'])) {
      try {
        const OrderCheck = JSON.parse(JSON.stringify(state))
        if (!OrderCheck.hasOwnProperty('price')) OrderCheck.price = 0
        OrderCheck.quantity = 1
        loadingState.preview = true
        const temp = await orderService.previewOrderDeposit(OrderCheck) as IOrder
        if (temp) {
          previewOrder.price = temp.price
          previewOrder.net_profit = temp.net_profit
          previewOrder.price_system = temp.price_system
          previewOrder.price_guest = temp.price_guest
        }

      } catch (e) {
        toast.add({title: e.data, color: "red", icon: "i-ic-round-error-outline"})
      } finally {
        loadingState.preview = false
      }
    }
  }, 500)
}

function checkIsPreivew(object1: any, keys: string[]): boolean {
  if (!object1.hasOwnProperty('id_service')) return false
  for (const [key, value] of Object.entries(object1)) {
    if (keys.includes(key) && (value === null || value === undefined || value == "")) {
      return false;
    }
  }
  return true;
}

function initFilter() {
  bodyFilter.partner_creator_id = user.value.id
  bodyFilter.order_status = 0
}

async function onChangeFilter(value: BodyFilter) {
  parameters.page = 1
  loading.value = true
  mapObject(value)
  await ListOrder(parameters, bodyFilter)
  loading.value = false
}

async function ListOrder(parameters: Partial<Pagination>, bodyFilter: Partial<BodyFilter>) {
  listOrder.value = []
  listOrder.value = await orderService.getOrders(parameters, bodyFilter)
}

async function acceptAsync(id: string) {
  loadingNhanDon.value = id
  try {
    await orderService.acceptAsync(id)
    toast.add({
      title: "Nhận đơn thành công",
      color: 'green',
      icon: 'i-mdi-success-circle-outline'
    })
    ListOrder(parameters, bodyFilter)
  } catch (e) {
    toast.add({
      title: "Nhận đơn không thành công",
      description: e.data,
      color: 'red',
      icon: 'i-tdesign-notification-error'
    })
  } finally {
    loadingNhanDon.value = ''
  }
}

function mapObject(value: BodyFilter) {
  for (const [key, _value] of Object.entries(value)) {
    bodyFilter[key] = _value
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>
<template>
  <UModal prevent-close v-model="isOpenAdd">
    <UCard :ui="{ ring: '' , divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <div class="flex mb-2 pb-2 items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Thêm Mới Chuyến
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                 @click="isOpenAdd = false"/>
      </div>
      <UForm :schema="schema" :state="state" class="space-y-2" @submit="onSubmit">
        <div class="flex space-x-2">
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Tên Khách Hàng" class="w-6/12" name="full_name">
            <UInput v-model="state.full_name"/>
          </UFormGroup>

          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Số điện thoại" class="w-6/12" name="phone">
            <UInput v-model="state.phone" type="text"/>
          </UFormGroup>
        </div>
        <div class="flex flex-wrap md:flex-nowrap md:space-y-0 space-y-2 md:space-x-2">
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Ngày đi" class="md:w-6/12 w-full"
                      name="date_of_destination">
            <UInput v-model="state.date_of_destination" class="w-full" :min="state.date_of_destination"
                    type="datetime-local"/>
          </UFormGroup>
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Dịch vụ" class="md:w-6/12 w-full" name="id_service">
            <USelectMenu
                class="w-full"
                v-model="state.id_service"
                :options="data.service"
                value-attribute="id"
                option-attribute="name"
            />
          </UFormGroup>
        </div>
        <div class="flex space-x-2">
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Thành phố đón" class="w-6/12" name="destination_city">
            <USelectMenu
                class="w-full"
                v-model="data.tempCity_1"
                :options="data.city.filter(item=>item.id != data.tempCity_2)"
                value-attribute="id"
                option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Quận huyện đón" class="w-6/12" name="departure_dictrict">
            <USelectMenu
                class="w-full"
                :options="data.district1"
                v-model="state.departure_dictrict"
                value-attribute="name"
                option-attribute="name"
            />
          </UFormGroup>
        </div>
        <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Chi tiết địa chỉ đón" class="w-full"
                    name="destination_address_1">
          <UInput v-model="state.destination_address_1" type="text"/>
        </UFormGroup>
        <div class="flex space-x-2">
          <UFormGroup size="xs" label="Thành phố trả" class="w-6/12" name="departure_city">
            <USelectMenu
                class="w-full"
                v-model="data.tempCity_2"
                :options="data.city.filter(item=>item.id != data.tempCity_1)"
                value-attribute="id"
                option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Quận huyện trả" class="w-6/12" name="destination_dictrict">
            <USelectMenu
                class="w-full"
                v-model="state.destination_dictrict"
                :options="data.district2"
                value-attribute="name"
                option-attribute="name"
            />
          </UFormGroup>
        </div>
        <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Chi tiết địa chỉ trả" class="w-full"
                    name="departure_address_1">
          <UInput v-model="state.departure_address_1" type="text"/>
        </UFormGroup>
        <div class="flex space-x-2">
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Cước thu khách" class="w-6/12">
            <UInput :loading="loadingState.preview"
                    :disabled="loadingState.preview"
                    @input="(e)=>state.price_guest = reverseNumberFormat(e.target.value)"
                    :value="formatNumber(previewOrder.price_guest)" type="text"/>
          </UFormGroup>
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Tài xế nhận" class="w-6/12">
            <UInput  :disabled="loadingState.preview" :loading="loadingState.preview" @input="(e)=> state.price = reverseNumberFormat(e.target.value)"
                     :value="formatNumber(previewOrder.price)" type="text"/>
          </UFormGroup>
        </div>
        <div class="flex space-x-2">
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Phí sàn" hint="Không thể sửa" class="w-6/12">
            <UInput disabled :loading="loadingState.preview" :value="formatNumber(previewOrder.price_system)"
                    type="text"/>
          </UFormGroup>
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Hoa hồng" hint="Không thể sửa" class="w-6/12">
            <UInput :loading="loadingState.preview" disabled :value="formatNumber(previewOrder.net_profit)"
                    type="text"/>
          </UFormGroup>
        </div>
        <UFormGroup :ui="{error:'mt-1'}" hint="Không bắt buộc" size="xs" label="Ghi chú" class="w-full">
          <UInput v-model="state.note" type="text"/>
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

<style scoped>

</style>