<template>
   <Filter></Filter>
   <div class="overflow-y-auto table-responsive">
      <UTable :loading="loading" :columns="columns" :rows="listOrder?.data">
         <template #short_id-data="{ row }">
            <UBadge color="sky" variant="subtle">{{ row?.short_id }}</UBadge>
         </template>
         <template #departure-data="{ row }">
            <div class="flex flex-col">
               <div class="flex items-center gap-2">
                 <UIcon name="i-wpf-geo-fence" class="text-green-500" /> {{ Object.values(row?.departure)?.join(" - ") }}
               </div>
               <div class="flex items-center gap-2">
                  <UIcon name="i-wpf-geo-fence" class="text-red-500" /> {{ Object.values(row?.destination)?.join(" - ") }}
               </div>
               <div class="flex items-center font-semibold gap-2" v-if="row?.note">
                  <UIcon name="i-hugeicons-note-03" class="text-indigo-400" />  "{{row?.note}}"
               </div>
              
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
                  <UBadge color="sky" class="w-20" variant="subtle">Tài xế thu</UBadge>   
                  {{ VND(row?.price_guest) }}
               </div>
               <div class="flex gap-2">
                  <UBadge color="green" class="w-20" variant="subtle">Tài xế nhận</UBadge>   
                  {{ VND(row?.price) }}
               </div>
            </div>
            
         </template>
         <template #action-data="{ row }">
            <UButton variant="soft">Nhận chuyến</UButton>
         </template>
      </UTable>
   </div>
   <div class="flex">
      <UPagination :disabled="loading" :page-count="10" v-model="parameters.page" class="mt-5 ms-auto me-10"
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