<script setup lang="ts">
import {type Booking, OrderService} from "~/services/OrderService";
import type {BodyFilter, Pagination} from "~/model/FilterModal";

const {parameters, bodyFilter} = useFilter();
const user = useUser();

const orderService = new OrderService();
const loading = ref(true);
const listOrder = ref<Partial<{ pagination: Pagination, data: Booking[] }>>()
const items = (row: any) => [
  [{
    label: 'Xem chi tiết đơn hàng',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Nhận đơn hàng',
    icon: 'i-heroicons-document-duplicate-20-solid'
  }], [{
    label: 'Hủy đơn hàng',
    icon: 'i-heroicons-trash-20-solid'
  }]
]
const columns = [
  {
    key: 'short_id',
    label: 'Mã chuyến'
  },
  {
    key: 'customer',
    label: 'Khách hàng'
  },
  {
    key: 'date_of_destination',
    label: "Ngày đi"
  },
  {
    key: 'name_service',
    label: 'Dịch vụ'
  },
  {
    key: 'type_name',
    label: 'Đối tượng hủy'
  },
  {
    key: 'status',
    label: 'Trạng thái'
  }
]
//  khởi tạo filter
initFilter()
// gọi khi thay đổi
watchEffect(async () => {
  loading.value = true
  await ListOrder(parameters, bodyFilter)
  loading.value = false
})

function initFilter() {
  bodyFilter.order_cancel_type = "khách hàng"
  bodyFilter.order_status_value = "Chờ duyệt"
  parameters.fields = 'id,short_id,order_short_id,order_id,type_value,customer,status_value,departure,destination,name_service,date_of_destination'
}

async function ListOrder(parameters: Partial<Pagination>, bodyFilter: Partial<BodyFilter>) {
  listOrder.value = await orderService.getOrdersCancelProgressAsync(parameters, bodyFilter)
}

async function onChangeFilter(value: BodyFilter) {
  parameters.page = 1
  loading.value = true
  mapObject(value)
  await ListOrder(parameters, bodyFilter)
  loading.value = false
}
function mapObject(value: BodyFilter){
  for (const [key, _value] of Object.entries(value)) {
    bodyFilter[key] = _value
  }
}
</script>

<template>
  <div class="sticky top-[60px] md:top-[55px] bg-white z-20">
    <Filter @change="onChangeFilter"></Filter>
  </div>
  <UTable :loading="loading" class="hidden md:block" :columns="columns" :rows="listOrder?.data">
    <template #customer-data="{ row }">
      <div class="flex flex-col gap-1">
        <div class="flex items-center font-semibold gap-2">
          {{ row?.customer?.full_name }}
        </div>
        <div class="flex items-center gap-2">
          <a :href="`tel:${row?.customer?.phone}`" class="hover:text-primary"> {{ row?.customer?.phone }}</a>
        </div>
      </div>
    </template>
    <template #short_id-data="{ row }">
      <UBadge color="sky" variant="subtle">{{ row?.short_id }}</UBadge>
    </template>
    <template #departure-data="{ row }">
      <div class="flex flex-col">
        <a class="flex hover:text-primary items-center gap-2" target="_blank"
           :href="`https://www.google.com/maps/search/${Object.values(row?.departure)?.join('-')}`">
          <UIcon name="i-wpf-geo-fence" class="text-green-500"/>
          {{ Object.values(row?.departure)?.join(" - ") }}
        </a>
        <a class="flex hover:text-primary items-center gap-2" target="_blank"
           :href="`https://www.google.com/maps/search/${Object.values(row?.destination)?.join('-')}`">
          <UIcon name="i-wpf-geo-fence" class="text-red-500"/>
          {{ Object.values(row?.destination)?.join(" - ") }}
        </a>
      </div>
    </template>
    <template #date_of_destination-data="{ row }">
      {{ convertUTCToLocal(row?.date_of_destination) }}
    </template>
    <template #status-data="{ row }">
       <UBadge color="yellow" variant="subtle">
         Yêu Cầu Hủy
       </UBadge>
      <br>
       <UBadge class="mt-1" variant="subtle">
         Admin Đang Xác Minh
       </UBadge>

    </template>
    <template #type_name-data="{row}">
      {{ row.type_value }}
    </template>
  </UTable>
  <div class="block mt-2 md:hidden">
    <LoadingMobile v-if="loading"/>
    <template v-else>
      <UCard :ui="{ ring: '', shadow: 'shadow-md' }" v-for="item in listOrder?.data" class="mb-3">
        <div class="flex gap-2 mb-3">
          <div class="flex flex-col gap-1">
            <div class="flex items-center font-semibold gap-2">
              {{ item?.customer?.full_name }}
            </div>
            <a :href="`tel:${item?.customer?.phone}`" class=" flex  items-center gap-2">
              {{ item?.customer?.phone }}
            </a>
          </div>
          <UDivider orientation="vertical" class="mx-auto"/>
          <div class="flex flex-col  gap-1">
            <UBadge  :ui="{ base: 'block text-center text-nowrap' }" variant="subtle">
              Admin Đang Xác Minh
            </UBadge>
          </div>
        </div>
        <!-- Dịch vụ -->
        <div class="flex items-center gap-2">
          <div class="p-2 bg-primary-100 flex items-center justify-center rounded">
            <UIcon name="i-ion-car-sport-sharp" class="text-primary text-md"/>
          </div>
          <div class="font-bold">{{ item.name_service }}</div>
          <UBadge color="yellow" :ui="{ base: 'block w-20 text-center text-nowrap' }" variant="subtle">
            Yêu Cầu Hủy
          </UBadge>
        </div>
        <!-- Giở khởi hành -->
        <div class="flex items-center mt-1 gap-1">
          <div class="p-2 bg-cyan-100 flex items-center justify-center rounded">
            <UIcon name="i-mdi-calendar" class="text-cyan-600 text-md"/>
          </div>
          {{ convertUTCToLocal(item?.date_of_destination) }}
        </div>
        <!-- Địa chi đón -->
        <div class="flex mt-1 items-center gap-2">
          <div class="p-2 bg-green-100 flex items-center justify-center rounded">
            <UIcon name="i-wpf-geo-fence" class="text-green-500 text-md"/>
          </div>
          {{ Object.values(item?.departure)?.join(" - ") }}
        </div>
        <!-- Địa chi trả -->
        <div class="flex items-start gap-2 mt-1">
          <div class="p-2 bg-red-100 flex items-center justify-center rounded">
            <UIcon name="i-wpf-geo-fence" class="text-red-500 text-md"/>
          </div>
          {{ Object.values(item?.destination)?.join(" - ") }}
        </div>
        <!-- Note -->
        <div class="flex items-center mt-1  font-semibold gap-2" v-if="item?.note">
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

<style scoped></style>