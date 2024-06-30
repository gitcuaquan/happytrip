<script setup lang="ts">
import {type Booking, OrderService} from "~/services/OrderService";
import type {BodyFilter, Pagination} from "~/model/FilterModal";

const {parameters, bodyFilter} = useFilter();
const user = useUser();
const toast = useToast()
const orderCancelUser = ref();
const orderCancel = ref<Booking>();
const isOpenModalCanel = ref(false)
const orderService = new OrderService();
const loading = ref(true);
const listOrder = ref<Partial<{ pagination: Pagination, data: Booking[] }>>()

const items = (row: any) => [
  [{
    label: 'Hoàn thành đơn',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => {
      orderSuccess(row.id)
    }
  },
    {
      label: 'Hủy đơn hàng',
      icon: 'i-heroicons-trash-20-solid',
      click: () => {
        isOpenModalCanel.value = true;
        orderCancel.value = row
      }
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
  bodyFilter.have_partner = true
}

async function ListOrder(parameters: Partial<Pagination>, bodyFilter: Partial<BodyFilter>) {
  listOrder.value = await orderService.getOrders(parameters, bodyFilter)
}

async function onChangeFilter(value: BodyFilter) {
  parameters.page = 1
  loading.value = true
  mapObject(value)
  //  boddy
  await ListOrder(parameters, bodyFilter)
  loading.value = false
}

function mapObject(value: BodyFilter){
  for (const [key, _value] of Object.entries(value)) {
      bodyFilter[key] = _value
  }
}

async function orderSuccess(id:string) {
  try {
    await orderService.completeAsync(id)
    toast.add({
      title: "Chúc mừng bạn đã hoàn thành đơn hàng",
      color: 'green',
      icon: 'i-mdi-success-circle-outline'
    })
    await ListOrder(parameters, bodyFilter)
  }catch (e) {
    toast.add({
      title: "Hành động lỗi",
      description: e.data,
      color: 'red',
      icon: 'i-tdesign-notification-error'
    })
    console.log(e.data)
  }
}

async function confirmCancel() {
  try {
    await orderService.rejectAsync(orderCancel.value?.id || '', orderCancelUser.value)
    if (orderCancelUser.value != 'customer') {
      toast.add({
        title: "Hủy đơn thành công",
        color: 'green',
        icon: 'i-mdi-success-circle-outline'
      })
    }else {
      toast.add({
        title: "Hủy đơn được ghi nhận vui lòng liên hệ admin để xác nhận",
        color: 'orange',
        icon: 'i-mdi-success-circle-outline'
      })
    }
    await ListOrder(parameters, bodyFilter)
  } catch (e) {
    toast.add({
      title: "Nhận đơn không thành công",
      description: e.data,
      color: 'red',
      icon: 'i-tdesign-notification-error'
    })
    console.log(e.message)
  } finally {
    isOpenModalCanel.value = false
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
          {{ [row?.departure.address_1, row?.departure.district, row?.departure.city]?.join(" - ") }}
        </a>
        <a class="flex hover:text-primary items-center gap-2" target="_blank"
           :href="`https://www.google.com/maps/search/${Object.values(row?.destination)?.join('-')}`">
          <UIcon name="i-wpf-geo-fence" class="text-red-500"/>
          {{ [row?.destination.address_1, row?.destination.district, row?.destination.city]?.join(" - ") }}
        </a>
      </div>
    </template>
    <template #date_of_destination-data="{ row }">
      {{ convertUTCToLocal(row?.date_of_destination) }}
    </template>
    <template #price_sys-data="{ row }">

      <div class="flex flex-col gap-1">
        <div class="flex gap-2">
          <UBadge color="sky" class="w-20 text-nowrap" variant="subtle">Tài xế thu</UBadge>
          {{ VND(row?.price_guest) }}
        </div>
        <div class="flex gap-2">
          <UBadge color="green" class="w-20 text-nowrap" variant="subtle">Tài xế nhận</UBadge>
          {{ VND(row?.price) }}
        </div>
      </div>
    </template>
    <template #status-data="{ row }">
      <UBadge color="blue" variant="subtle">
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
    <template #action-header="{ row }">
      <div class="text-right">
        Hành động
      </div>
    </template>
  </UTable>
  <div class="block mt-2 md:hidden">
    <LoadingMobile v-if="loading"/>
    <template v-else>
      <EmptyDataMobile v-if="!listOrder?.data?.length"/>
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
            <div class="flex  ms-auto gap-2">
              {{ VND(item?.price_guest) }}
              <UBadge color="cyan" :ui="{ base: 'block w-20 text-center text-nowrap' }" variant="subtle">Tài xế thu
              </UBadge>
            </div>
            <div class="flex  ms-auto gap-2">
              {{ VND(item?.price) }}
              <UBadge color="amber" :ui="{ base: 'block w-20 text-center text-nowrap' }" variant="subtle">Tài xế nhận
              </UBadge>
            </div>
          </div>
        </div>
        <!-- Dịch vụ -->
        <div class="flex items-center gap-2">
          <div class="p-2 bg-primary-100 flex items-center justify-center rounded">
            <UIcon name="i-ion-car-sport-sharp" class="text-primary text-md"/>
          </div>
          <div class="font-bold">{{ item.name_service }}</div>
          <UBadge color="green" variant="subtle">
            Đã nhận
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
        <div class="flex items-center mt-2  gap-2 justify-center">
          <UButton @click="orderSuccess(item.id)" icon="i-mdi-car-arrow-left" color="green">
            Hoàn thành
          </UButton>
          <UButton @click="() => {
          isOpenModalCanel = true;
          orderCancel = item
        }" icon="i-mdi-car-arrow-right" color="red" variant="soft">
            Hủy chuyến
          </UButton>
        </div>
      </UCard>
    </template>
  </div>
  <div class="flex" v-if="listOrder?.data?.length">
    <UPagination :disabled="loading" :page-count="10" v-model="parameters.page" class="mt-5 ms-auto me-10"
                 :total="listOrder?.pagination?.count ?? 1"/>
  </div>
  <UModal v-model="isOpenModalCanel" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Hủy đơn hàng <b>[{{ orderCancel.short_id }}]</b>
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                   @click="isOpenModalCanel = false"/>
        </div>
      </template>

      Bạn chuẩn bị thực hiện hàng động hủy đơn hàng <b>[{{ orderCancel.short_id }}]</b> của khách hàng
      <b>{{ orderCancel.customer.full_name }}</b>. Vui lòng cho chúng tôi biết ai
      muốn hủy chuyến !
      <URadioGroup color="primary" class="mt-3" model-value="partner" v-model="orderCancelUser"
                   legend="Đối tượng yêu cầu hủy chuyến đi"
                   :options="[{ value: 'partner', label: 'Tài xế hủy chuyến' }, { value: 'customer', label: 'Khách hàng hủy chuyến' }]"/>
      <template #footer>
        <div class="flex">
          <UButton @click="confirmCancel" :disabled="!orderCancelUser" class="mx-auto" color="red">
            Xác nhận hủy
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>