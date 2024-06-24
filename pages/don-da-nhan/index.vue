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
    key: 'departure',
    label: 'Điểm đón - Điểm trả'
  },
  {
    key: 'status',
    label: 'Trạng thái'
  },
  {
    key: 'price_sys',
    label: "Cước thu"
  },
  {
    key: 'action',
    label: "Hành động"
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
  bodyFilter.partner_id = user.value.id
  bodyFilter.order_status = 1
}

async function ListOrder(parameters: Partial<Pagination>, bodyFilter: Partial<BodyFilter>) {
  listOrder.value = await orderService.getOrders(parameters, bodyFilter)
}

async function onChangeFilter(value: BodyFilter) {
  parameters.page = 1
  loading.value = true
  await ListOrder(parameters, value)
  loading.value = false
}
</script>

<template>
  <div class="sticky top-[60px] md:top-[55px] bg-white z-20">
    <Filter></Filter>
  </div>
  <UTable :loading="loading" class="hidden md:block" :columns="columns" :rows="listOrder?.data">
    <template #customer-data="{row}">
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
        <a class="flex hover:text-primary items-center gap-2"
           target="_blank"
           :href="`https://www.google.com/maps/search/${ Object.values(row?.departure)?.join('-') }`">
          <UIcon name="i-wpf-geo-fence" class="text-green-500"/>
          {{ Object.values(row?.departure)?.join(" - ") }}
        </a>
        <a class="flex hover:text-primary items-center gap-2"
           target="_blank"
           :href="`https://www.google.com/maps/search/${ Object.values(row?.destination)?.join('-') }`">
          <UIcon name="i-wpf-geo-fence" class="text-red-500"/>
          {{ Object.values(row?.destination)?.join(" - ") }}
        </a>
      </div>
    </template>
    <template #date_of_destination-data="{ row }">
      {{ convertUTCToLocal(row?.date_of_destination) }}
    </template>
    <template #price_sys-data="{ row }">
      {{ VND(row?.price_guest) }}
    </template>
    <template #status-data="{row}">
      <UBadge color="green" variant="subtle">
          Đã nhận
      </UBadge>
    </template>
    <template #action-data="{ row }">
      <div class="text-right">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"/>
        </UDropdown>
      </div>
    </template>
    <template #action-header="{row}">
      <div class="text-right">
        Hành động
      </div>
    </template>
  </UTable>
  <div class="block mt-2 md:hidden">
    <UCard v-for="item in listOrder?.data" class="mb-3">
      <template #header>
        <div class="flex gap-2">
          <div class="flex gap-2 flex-col">
            <div class="font-semibold">
              {{ item.name_service }}
            </div>
            <div class="flex gap-1 align-center">
              <UIcon class="text-2xl" name="i-carbon-train-time" dynamic/>

              {{ convertUTCToLocal(item?.date_of_destination) }}

            </div>
          </div>
          <div class="flex gap-2  ms-auto flex-col">
            <UButton>Nhận chuyến</UButton>
            <UBadge color="sky" class="justify-center" variant="subtle">{{ item?.short_id }}</UBadge>
          </div>
        </div>
      </template>
      <div class="flex items-center gap-2">
        <UIcon name="i-wpf-geo-fence" class="text-green-500"/>
        {{ Object.values(item?.departure)?.join(" - ") }}
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-wpf-geo-fence" class="text-red-500"/>
        {{ Object.values(item?.destination)?.join(" - ") }}
      </div>
      <div class="flex items-center font-semibold gap-2" v-if="item?.note">
        <UIcon name="i-hugeicons-note-03" class="text-indigo-400"/>
        "{{ item?.note }}"
      </div>
      <div class="flex flex-wrap mt-3 gap-2">
        <div class="flex gap-2">
          <UBadge color="sky" variant="subtle">Tài xế thu</UBadge>
          {{ VND(item?.price_guest) }}
        </div>
        <div class="flex ms-auto gap-2">
          <UBadge color="green" variant="subtle">Tài xế nhận</UBadge>
          {{ VND(item?.price) }}
        </div>
      </div>
    </UCard>
  </div>
  <div class="flex">
    <UPagination :disabled="loading" :page-count="10" v-model="parameters.page" class="mt-5 ms-auto me-10"
                 :total="listOrder?.pagination?.count ?? 1"/>
  </div>
</template>

<style scoped>

</style>