<template>
  <div class="sticky top-[60px] md:top-[55px] bg-white z-20">
    <Filter @change="onChangeFilter"></Filter>
  </div>
  <UTable :loading="loading" class="hidden md:block" :columns="columns" :rows="listOrder?.data">
    <template #short_id-data="{ row }">
      <UBadge color="sky" variant="subtle">{{ row?.short_id }}</UBadge>
    </template>
    <template #departure-data="{ row }">
      <div class="flex flex-col">
        <a class="flex hover:text-primary items-center gap-2" target="_blank"
          :href="`https://www.google.com/maps/search/${[row?.departure.address_1, row?.departure.district, row?.departure.city]?.join('-')}`">
          <UIcon name="i-wpf-geo-fence" class="text-red-500" />
          {{ [row?.departure.address_1, row?.departure.district, row?.departure.city]?.join(" - ") }}
        </a>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-wpf-geo-fence" class="text-green-500" />
        {{ [row?.destination.address_1, row?.destination.district, row?.destination.city]?.join(" - ") }}
      </div>
      <div class="flex items-center font-semibold gap-2" v-if="row?.note">
        <UIcon name="i-hugeicons-note-03" class="text-indigo-400" />
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
    <template #action-data="{ row }">
      <UButton icon="i-mdi-car-arrow-left" :loading="loadingNhanDon == row.id" @click="acceptAsync(row?.id)">Nhận chuyến
      </UButton>
    </template>
  </UTable>
  <div class="block mt-2 md:hidden">
    <UCard v-for="item in listOrder?.data" class="mb-3">
      <div class="flex items-start">
        <div class="flex flex-col gap-2">
          <div class="flex font-bold gap-2">
            <UBadge color="cyan" class="w-20 text-nowrap" variant="subtle">Tài xế thu</UBadge>
            {{ VND(item?.price_guest) }}
          </div>
          <div class="flex font-bold  gap-2">
            <UBadge color="amber" class="w-20 text-nowrap" variant="subtle">Tài xế nhận</UBadge>
            {{ VND(item?.price) }}
          </div>
        </div>
        <div class="ms-auto">
          <UButton icon="i-mdi-car-arrow-left" :loading="loadingNhanDon == item.id" @click="acceptAsync(item?.id)"
            class="ms-auto">Nhận chuyến</UButton>
        </div>
      </div>
      <div class="flex items-center mt-1 gap-2">
        <div class="p-2 border bg-primary-100 border-primary flex items-center justify-center rounded">
          <UIcon name="i-ion-car-sport-sharp" class="text-primary text-md" />
        </div>
        <div class="flex flex-col">
          <div class="font-bold text-gray-600">
            {{ item.name_service }}
          </div>
          <div>
            {{ convertUTCToLocal(item?.date_of_destination) }}
          </div>
        </div>
      </div>
      <a target="_blank" :href="`https://www.google.com/maps/search/${[item?.departure.address_1, item?.departure.district, item?.departure.city]?.join('-')}`" class="flex items-center mt-1 gap-2">
        <div class="py-1 px-2 my-auto border border-green-500 rounded bg-green-100">
          <UIcon name="i-wpf-geo-fence" class="text-green-500 text-md" />
        </div>
        <div>
          {{ [item?.departure.address_1, item?.departure.district, item?.departure.city]?.join(" - ") }}
        </div>
      </a>
      <a target="_blank":href="`https://www.google.com/maps/search/${[item?.destination.address_1, item?.destination.district, item?.destination.city]?.join('-')}`" class="flex items-center mt-1 gap-2">
        <div class="py-1 px-2 my-auto border border-red-500 rounded bg-red-100">
          <UIcon name="i-wpf-geo-fence" class="text-red-500 text-md" />
        </div>
        {{ [item?.destination.address_1, item?.destination.district, item?.destination.city]?.join(" - ") }}
      </a>
      <div class="flex mt-1 items-center gap-2" v-if="item?.note">
        <div class="py-1 px-2 border border-indigo-500 rounded bg-indigo-100">
          <UIcon name="i-hugeicons-note-03" class="text-indigo-500 text-md" />
        </div>
        "{{ item?.note }}"
      </div>
    </UCard>
  </div>
  <div class="flex">
    <UPagination :disabled="loading" :page-count="10" v-model="parameters.page" class="mt-5 ms-auto me-10"
      :total="listOrder?.pagination?.count ?? 1" />
  </div>
</template>

<script lang="ts" setup>
import type { BodyFilter, Pagination } from '~/model/FilterModal';
import { OrderService, type Booking } from '~/services/OrderService';

const toast = useToast()
const { parameters, bodyFilter } = useFilter();
const orderService = new OrderService();
const loading = ref(true);
const loadingNhanDon = ref('');
const listOrder = ref<Partial<{ pagination: Pagination, data: Booking[] }>>()

const columns = [{
  key: 'short_id',
  label: 'Mã chuyến'
}, {
  key: 'name_service',
  label: 'Dịch vụ'
}, {
  key: 'departure',
  label: 'Điểm đón - Điểm trả - Ghi chú'
}, {
  key: 'date_of_destination',
  label: "Ngày đi"
},
{
  key: 'price_sys',
  label: "Giao dịch"
},
{
  key: 'action',
  label: "Hành động"
}

]


watchEffect(async () => {
  loading.value = true
  await ListOrder(parameters, bodyFilter)
  loading.value = false
})

async function onChangeFilter(value: BodyFilter) {
  parameters.page = 1
  loading.value = true
  await ListOrder(parameters, value)
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
</script>

<style>
@media (min-width: 768px) {
  .table-responsive {
    width: calc(100vw - 290px);
  }
}
</style>