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
        <div class="flex items-center font-semibold gap-2" v-if="row?.note">
          <UIcon name="i-hugeicons-note-03" class="text-indigo-400"/>
          "{{ row?.note }}"
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
      <UButton>Nhận chuyến</UButton>
    </template>
  </UTable>
  <div class="block mt-2 md:hidden">
    <UCard v-for="item in listOrder?.data" class="mb-3">
      <div class="flex">
        <div class="flex flex-col gap-2 my-3">
          <div class="flex font-bold gap-2">
            <UBadge color="sky" class="justify-center w-20" variant="subtle">Tài xế thu</UBadge>
            {{ VND(item?.price_guest) }}
          </div>
          <div class="flex font-bold  gap-2">
            <UBadge color="green" class="justify-center w-20" variant="subtle">Tài xế nhận</UBadge>
            {{ VND(item?.price) }}
          </div>
        </div>
        <div class="ms-auto my-auto">
          <UButton class="ms-auto">Nhận chuyến</UButton>
        </div>
      </div>
      <UDivider label="Thông tin dịch vụ"/>
      <div class="flex items-center my-2 gap-2">
        <div class="p-3 border bg-primary-100 border-primary flex items-center justify-center rounded-full">
          <UIcon name="i-ion-car-sport-sharp" class="text-primary text-3xl"/>
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
      <UDivider label="Thông tin địa điểm"/>
      <div class="flex items-center my-2 gap-2">
        <UIcon name="i-wpf-geo-fence" class="text-green-500"/>
        {{ Object.values(item?.departure)?.join(" - ") }}
      </div>
      <div class="flex items-start gap-2">
        <UIcon name="i-wpf-geo-fence" class="text-red-500"/>
        {{ Object.values(item?.destination)?.join(" - ") }}
      </div>
      <div class="flex items-center  font-semibold gap-2" v-if="item?.note">
        <UIcon name="i-fluent-comment-note-20-filled" class="text-indigo-400"/>
        "{{ item?.note }}"
      </div>
    </UCard>
    <!--    <UCard v-for="item in listOrder?.data" class="mb-3">-->
    <!--      <template #header>-->
    <!--        <div class="flex gap-2">-->
    <!--          <div class="flex gap-2 flex-col">-->
    <!--            <div class="font-semibold">-->
    <!--              {{ item.name_service }}-->
    <!--            </div>-->
    <!--            <div class="flex gap-1 align-center">-->
    <!--              <UIcon class="text-2xl" name="i-carbon-train-time" dynamic/>-->

    <!--                {{ convertUTCToLocal(item?.date_of_destination) }}-->

    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="flex gap-2  ms-auto flex-col">-->
    <!--            <UButton>Nhận chuyến</UButton>-->
    <!--            <UBadge color="sky" class="justify-center" variant="subtle">{{ item?.short_id }}</UBadge>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--      <div class="flex items-center gap-2">-->
    <!--        <UIcon name="i-wpf-geo-fence" class="text-green-500"/>-->
    <!--        {{ Object.values(item?.departure)?.join(" - ") }}-->
    <!--      </div>-->
    <!--      <div class="flex items-center gap-2">-->
    <!--        <UIcon name="i-wpf-geo-fence" class="text-red-500"/>-->
    <!--        {{ Object.values(item?.destination)?.join(" - ") }}-->
    <!--      </div>-->
    <!--      <div class="flex items-center font-semibold gap-2" v-if="item?.note">-->
    <!--        <UIcon name="i-hugeicons-note-03" class="text-indigo-400"/>-->
    <!--        "{{ item?.note }}"-->
    <!--      </div>-->
    <!--      <div class="flex flex-wrap mt-3 gap-2">-->
    <!--        <div class="flex gap-2">-->
    <!--          <UBadge color="sky" variant="subtle">Tài xế thu</UBadge>-->
    <!--          {{ VND(item?.price_guest) }}-->
    <!--        </div>-->
    <!--        <div class="flex ms-auto gap-2">-->
    <!--          <UBadge color="green"  variant="subtle">Tài xế nhận</UBadge>-->
    <!--          {{ VND(item?.price) }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </UCard>-->
  </div>
  <div class="flex">
    <UPagination :disabled="loading" :page-count="10" v-model="parameters.page" class="mt-5 ms-auto me-10"
                 :total="listOrder?.pagination?.count ?? 1"/>
  </div>
</template>

<script lang="ts" setup>
import type {BodyFilter, Pagination} from '~/model/FilterModal';
import {OrderService, type Booking} from '~/services/OrderService';

const {parameters, bodyFilter} = useFilter();
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

</script>

<style>
@media (min-width: 768px) {
  .table-responsive {
    width: calc(100vw - 290px);
  }
}
</style>