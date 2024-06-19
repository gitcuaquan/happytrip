<template>
   <Filter></Filter>
   <div class="overflow-y-auto table-responsive">
      <UTable :loading="loading" :columns="columns" :rows="listOrder?.data">
         <template #short_id-data="{ row }">
            <UBadge color="blue" variant="subtle">{{ row?.short_id }}</UBadge>
         </template>
         <template #departure-data="{ row }">
            {{ Object.values(row?.departure)?.join(" - ") }}
         </template>
         <template #destination-data="{ row }">
            {{ Object.values(row?.destination)?.join(" - ") }}
         </template>
         <template #date_of_destination-data="{ row }">
            {{ convertUTCToLocal(row?.date_of_destination) }}
         </template>
         <template #price_guest-data="{ row }">
            {{ VND(row?.price_guest) }}
         </template>
         <template #price-data="{ row }">
            {{ VND(row?.price) }}
         </template>
         <template #action-data="{ row }">
            <UButton variant="soft">Nhận chuyến</UButton>
         </template>
      </UTable>
   </div>
   <div class="flex">
      <UPagination :page-count="10" v-model="parameters.page" class="mt-5 ms-auto me-10"
         :total="listOrder?.pagination?.count ?? 1" />
   </div>
</template>

<script lang="ts" setup>
import type { BodyFilter, Pagination } from '~/model/FilterModal';
import { OrderService, type Booking } from '~/services/OrderService';

const { parameters, bodyFilter } = useFilter();
const orderService = new OrderService();
const loading = ref(true);
const listOrder = ref<Partial<{ pagination: Pagination, data: Booking[] }>>()

const columns = [{
   key: 'short_id',
   label: 'Mã chuyến'
}, {
   key: 'name_service',
   label: 'Dịch vụ'
}, {
   key: 'departure',
   label: 'Điểm đón'
}, {
   key: 'destination',
   label: 'Điểm trả'
}, {
   key: 'date_of_destination',
   label: "Ngày đi"
},
{
   key: 'price_guest',
   label: "Cước thu"
},
{
   key: 'price',
   label: "Tài xế nhận"
},
{
   key: 'note',
   label: "Ghi chú"
},
{
   key: 'action',
   label: "Hành động"
}

]


watchEffect(async () => {
   await ListOrder(parameters, bodyFilter)
})

async function ListOrder(parameters: Partial<Pagination>, bodyFilter: Partial<BodyFilter>) {
   loading.value = true
   listOrder.value = await orderService.getOrders(parameters, bodyFilter)
   loading.value = false
}

</script>

<style>


@media (min-width: 768px) {
   .table-responsive {
      width: calc(100vw - 290px);
   }
}
</style>