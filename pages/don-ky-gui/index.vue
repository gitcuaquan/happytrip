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
            <UInput :loading="loadingState.preview" v-model="previewOrder.price_guest" type="text"/>
          </UFormGroup>
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Tài xế nhận" class="w-6/12">
            <UInput :loading="loadingState.preview" v-model="previewOrder.price" type="text"/>
          </UFormGroup>
        </div>
        <div class="flex space-x-2">
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Phí sàn" hint="Không thể sửa" class="w-6/12">
            <UInput disabled :loading="loadingState.preview" v-model="previewOrder.price_system" type="text"/>
          </UFormGroup>
          <UFormGroup :ui="{error:'mt-1'}" size="xs" label="Hoa hồng" hint="Không thể sửa" class="w-6/12">
            <UInput :loading="loadingState.preview" disabled v-model="previewOrder.net_profit" type="text"/>
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

  <div class="sticky top-[60px] md:top-[55px] bg-white z-20">
    <Filter @change="onChangeFilter"></Filter>
  </div>
  <div class="flex gap-2 p-3 border my-2 rounded">
    <UButton size="xs" color="teal" variant="soft">
      Đơn Còn Giá Trị
    </UButton>
    <UButton size="xs" color="teal" variant="soft">
      Đơn Hết Giá Trị
    </UButton>
    <UButton @click="isOpenAdd = true" size="xs" color="green" variant="outline" icon="i-hugeicons-note-add"
             class="ms-auto">
      Thêm Mới
    </UButton>
  </div>
  <UTable :loading="loading" class="hidden md:block" :columns="columns" :rows="listOrder?.data">
    <template #short_id-data="{ row }">
      <UBadge color="sky" variant="subtle">{{ row?.short_id }}</UBadge>
    </template>
    <template #departure-data="{ row }">
      <div class="flex flex-col">
        <a class="flex hover:text-primary items-center gap-2" target="_blank"
           :href="`https://www.google.com/maps/search/${[row?.departure.address_1, row?.departure.district, row?.departure.city]?.join('-')}`">
          <UIcon name="i-wpf-geo-fence" class="text-red-500"/>
          {{ [row?.departure.address_1, row?.departure.district, row?.departure.city]?.join(" - ") }}
        </a>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-wpf-geo-fence" class="text-green-500"/>
        {{ [row?.destination.address_1, row?.destination.district, row?.destination.city]?.join(" - ") }}
      </div>
      <div class="flex items-center font-semibold gap-2" v-if="row?.note">
        <UIcon name="i-hugeicons-note-03" class="text-indigo-400"/>
        "{{ row?.note }}"
      </div>
    </template>
    <template #date_of_destination-data="{ row }">
      {{ convertUTCToLocal(row?.date_of_destination) }}
    </template>
    <template #price_guest-data="{ row }">
      {{ VND(row?.price_guest) }}
    </template>
    <template #price_sys-data="{ row }">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <UBadge color="cyan" class="w-20 text-nowrap" variant="subtle">Tài xế thu</UBadge>
          {{ VND(row?.price_guest) }}
        </div>
        <div class="flex gap-2">
          <UBadge color="amber" class="w-20 text-nowrap" variant="subtle">Tài xế nhận</UBadge>
          {{ VND(row?.price) }}
        </div>
      </div>
    </template>
    <template #net_profit-data=" {row}">
      {{ VND(row?.net_profit) }}
    </template>
    <template #action-data="{ row }">
      <UButton icon="i-mdi-car-arrow-left" :loading="loadingNhanDon == row.id" @click="acceptAsync(row?.id)">Nhận chuyến
      </UButton>
    </template>
  </UTable>
  <div class="block mt-2 md:hidden">
    <LoadingMobile v-if="loading"/>
    <template v-else>
      <UCard v-for="item in listOrder?.data" class="mb-3">
        <div class="flex items-start">
          <div class="flex flex-col gap-2">
            <div class="flex font-bold gap-2">
              <UBadge color="cyan" class="w-20 text-nowrap" variant="subtle">Tài xế thu</UBadge>
              {{ VND(item?.price_guest) }}
            </div>
            <div class="flex font-bold mt-2 gap-2">
              <UBadge color="amber" class="w-20 text-nowrap" variant="subtle">Tài xế nhận</UBadge>
              {{ VND(item?.price) }}
            </div>
          </div>
          <div class="ms-auto">
            <UButton icon="i-mdi-car-arrow-left" :loading="loadingNhanDon == item.id" @click="acceptAsync(item?.id)"
                     class="ms-auto">Nhận chuyến
            </UButton>
            <div class="flex font-bold mt-2  gap-2">
              <UBadge color="pink" class="text-nowrap" variant="subtle">Hoa Hồng</UBadge>
              {{ VND(item?.net_profit) }}
            </div>
          </div>
        </div>
        <div class="flex items-center mt-1 gap-2">
          <div class="p-2 bg-primary-100 flex items-center justify-center rounded">
            <UIcon name="i-ion-car-sport-sharp" class="text-primary text-md"/>
          </div>
          <div class="font-bold">{{ item.name_service }}</div>
        </div>
        <!-- Giở khởi hành -->
        <div class="flex items-center mt-1 gap-1">
          <div class="p-2 bg-cyan-100 flex items-center justify-center rounded">
            <UIcon name="i-mdi-calendar" class="text-cyan-600 text-md"/>
          </div>
          {{ convertUTCToLocal(item?.date_of_destination) }}
        </div>
        <a target="_blank"
           :href="`https://www.google.com/maps/search/${[item?.departure.address_1, item?.departure.district, item?.departure.city]?.join('-')}`"
           class="flex items-center mt-1 gap-2">
          <div class="py-1 px-2 my-auto rounded bg-green-100">
            <UIcon name="i-wpf-geo-fence" class="text-green-500 text-md"/>
          </div>
          <div class="leading-4">
            {{ [item?.departure.address_1, item?.departure.district, item?.departure.city]?.join(" - ") }}
          </div>
        </a>
        <a target="_blank"
           :href="`https://www.google.com/maps/search/${[item?.destination.address_1, item?.destination.district, item?.destination.city]?.join('-')}`"
           class="flex items-center mt-1 gap-2">
          <div class="py-1 px-2 my-auto rounded bg-red-100">
            <UIcon name="i-wpf-geo-fence" class="text-red-500 text-md"/>
          </div>
          {{ [item?.destination.address_1, item?.destination.district, item?.destination.city]?.join(" - ") }}
        </a>
        <div class="flex mt-1 items-center gap-2" v-if="item?.note">
          <div class="py-1 px-2 rounded bg-indigo-100">
            <UIcon name="i-hugeicons-note-03" class="text-indigo-500 text-md"/>
          </div>
          "{{ item?.note }}"
        </div>
      </UCard>
    </template>
  </div>
  <div class="flex">
    <UPagination :disabled="loading" :page-count="10" v-model="parameters.page" class="mt-5 ms-auto me-10"
                 :total="listOrder?.pagination?.count ?? 1"/>
  </div>
</template>

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
const isOpenAdd = ref(true);
var previewOrder = reactive<Partial<IOrder>>({})

const data = reactive({
  service: [],
  city: [],
  tempCity_1: "",
  tempCity_2: "",
  district1: [],
  district2: [],
})

const columns = [
  {
    key: 'short_id',
    label: 'Mã chuyến'
  },
  {
    key: 'name_service',
    label: 'Dịch vụ'
  },
  {
    key: 'departure',
    label: 'Điểm đón - Điểm trả - Ghi chú'
  },
  {
    key: 'date_of_destination',
    label: "Ngày đi"
  },
  {
    key: 'price_sys',
    label: "Giao dịch"
  },
  {
    key: 'net_profit',
    label: "Hoa hồng"
  },
  {
    key: 'action',
    label: "Hành động"
  }

]

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

watch(() => [state.destination_city,
  state.departure_city,
  state.date_of_destination,
  state.destination_dictrict,
  state.id_service,
  state.departure_dictrict,
  previewOrder.price,
  previewOrder.price_guest
], async (value) => {
  console.log("Check")
  if (checkIsPreivew(state, ['destination_city', 'departure_city', 'departure_dictrict', 'destination_dictrict', 'id_service'])) {
    state.quantity = 1
    loadingState.preview = true
    const temp = await orderService.previewOrderDeposit(state) as IOrder
    if (temp) {
      state.price = previewOrder.price = temp.price
      state.net_profit = previewOrder.net_profit = temp.net_profit
      state.price_system = previewOrder.price_system = temp.price_system
      state.price_guest = previewOrder.price_guest = temp.price_guest
    }
    loadingState.preview = false
  }
}, {deep: true})


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

<style>
@media (min-width: 768px) {
  .table-responsive {
    width: calc(100vw - 290px);
  }
}
</style>