<template>
  <div class="flex items-center md:flex-wrap p-2  border rounded gap-2">
    <UInput v-model="keyword" icon="i-heroicons-magnifying-glass-20-solid" size="sm"
            class="sm:w-44 min-w-44 w-80" color="white"
            :trailing="false" placeholder="Tìm kiếm từ khóa..."/>
    <UDivider orientation="vertical" class="h-7 hidden sm:block"/>
    <UButton @click="isOpen = true" class="ms-auto flex items-center p-2 sm:hidden">
      <UIcon name="i-bi-sliders" dynamic/>
    </UButton>
    <UBadge size="md" color="white" class="text-nowrap hidden sm:block" variant="soft">Điểm đón</UBadge>
    <USelectMenu class="hidden sm:block" v-model="city.don" :ui="{ base: 'w-36' }"
                 :ui-menu="{ width: 'w-36' }"
                 :options="[{name:'Tất Cả Thành Phố',value:''},...listCity?.filter(item=>item.status)]"
                 placeholder="Thành phố" value-attribute="id" option-attribute="name"/>

    <USelectMenu class="hidden sm:block" v-model="objectEmitter.district_depature" :ui="{ base: 'w-36' }"
                 :ui-menu="{ width: 'w-36' }"
                 :options=" listDistrictDiemDon?.districts?.filter(item=>item.status)" placeholder="Quận huyện"
                 value-attribute="name"
                 option-attribute="name"/>
    <UDivider orientation="vertical" class="h-7 hidden sm:block"/>

    <UBadge size="md" color="white" class="text-nowrap hidden sm:block" variant="soft">Điểm trả</UBadge>

    <USelectMenu v-model="city.tra" class="hidden sm:block" :ui="{ base: 'w-36' }"
                 :ui-menu="{ width: 'w-36' }"
                 :options="[{name:'Tất Cả Thành Phố',value:''},...listCity?.filter(item=>item.status)]"
                 placeholder="Thành phố" value-attribute="id"
                 option-attribute="name"/>

    <USelectMenu v-model="objectEmitter.district_destination" :ui="{ base: 'w-36' }" class="hidden sm:block"
                 :ui-menu="{ width: 'w-36' }"
                 :options="listDistrictDiemTra?.districts?.filter(item=>item.status) ?? []" placeholder="Quận huyện"
                 value-attribute="name"
                 option-attribute="name"/>

    <UDivider orientation="vertical" class="h-7 hidden sm:block"/>
    <UPopover class="hidden sm:block" :popper="{ placement: 'bottom-start' }">
      <UButton icon="i-heroicons-calendar-days-20-solid">
        {{ format(selected.start, 'd MMM, yyy', {locale: vi}) }} - {{
          format(selected.end, 'd MMM, yyy', {
            locale: vi
          })
        }}
      </UButton>
      <template #panel="{ close }">
        <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
          <div class="hidden sm:flex flex-col py-4">
            <UButton v-for="(range, index) in ranges" :key="index" :label="range.label" color="gray" variant="ghost"
                     class="rounded-none px-6"
                     :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
                     truncate @click="selectRange(range.duration)"/>
          </div>
          <DatePicker v-model="selected" @close="close"/>
        </div>
      </template>
    </UPopover>
  </div>

  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <div class="min-h-96">
        <UDivider label="Điểm đón" class="mb-3"/>
        <div class="flex justify-between mb-3">
          <USelectMenu class="mb-3 " v-model="city.don" :ui="{ base: 'w-40' }"
                       :ui-menu="{ width: 'w-40' }"
                       :options="listCity" placeholder="Thành phố" value-attribute="id" option-attribute="name"/>

          <USelectMenu class="mb-3 " v-model="objectEmitter.district_depature" :ui="{ base: 'w-40' }"
                       :ui-menu="{ width: 'w-40' }"
                       :options="listDistrictDiemDon?.districts ?? []" placeholder="Quận huyện" value-attribute="name"
                       option-attribute="name"/>
        </div>
        <UDivider label="Điểm trả" class="mb-3"/>
        <div class="flex justify-between mb-3">
          <USelectMenu v-model="city.tra" :ui="{ base: 'w-40' }" :ui-menu="{ width: 'w-40' }"
                       :options="listCity"
                       placeholder="Thành phố" value-attribute="id" option-attribute="name"/>

          <USelectMenu v-model="objectEmitter.district_destination" :ui="{ base: 'w-40' }" :ui-menu="{ width: 'w-44' }"
                       :options="listDistrictDiemTra?.districts ?? []" placeholder="Quận huyện" value-attribute="name"
                       option-attribute="name"/>
        </div>
        <div class="flex justify-center">
          <DatePicker v-model="selected"/>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import {CityService, type City, type CityDetails} from '~/services/CityService';
import {sub, format, isSameDay, type Duration} from 'date-fns'
import vi from 'date-fns/locale/vi'


const emitter = defineEmits(['change'])
const ranges = [
  {label: '7 Ngày gần nhất', duration: {days: 7}},
  {label: '14 Ngày gần nhất', duration: {days: 14}},
  {label: '30 Ngày gần nhất', duration: {days: 30}},
  {label: '3 Tháng gần nhất', duration: {months: 3}},
  {label: '6 Tháng gần nhất', duration: {months: 6}},
  {label: 'Năm trước', duration: {years: 1}}
]

const city = reactive({
  don: "",
  tra: ""
})
const objectEmitter = reactive({
  city_diemden: "",
  city_diemdon: '',
  district_depature: '',
  district_destination: '',
  from_date_of_destination: format(new Date(), 'yyyy-MM-dd'),
  id: '',
  keyword: "",
  order_expired: true,
  to_date_of_destination: format(sub(new Date(), {days: -7}), 'yyyy-MM-dd')
})
const selected = ref({start: new Date(), end: sub(new Date(), {days: -7})})
const isOpen = ref(false)
const {parameters, bodyFilter} = useFilter();

const cityService = new CityService();
const listCity = ref<City[]>([]);
const timeOut = ref<ReturnType<typeof setTimeout>>();
const keyword = ref("")
let listDistrictDiemDon = ref<CityDetails>();
let listDistrictDiemTra = ref<CityDetails>();

onMounted(async () => {
  parameters.limit = 250;
  parameters.fields = "id,name,code,status";
  listCity.value = await cityService.getCityAsync(parameters, {});
})
watch(() => keyword.value, (value) => {
  clearTimeout(timeOut.value);
  timeOut.value = setTimeout(() => {
    objectEmitter.keyword = value;
  }, 1000)
})
watch(() => objectEmitter, (value) => {
  emitter('change', value)
}, {deep: true});
watch(() => selected.value, () => {
  objectEmitter.from_date_of_destination = format(selected.value.start, 'yyyy-MM-dd')
  objectEmitter.to_date_of_destination = format(selected.value.end, 'yyyy-MM-dd')
})
watch(() => city.don, async () => {
  const _city = listCity.value.find((item) => item.id == city.don)
  objectEmitter.city_diemdon = _city?.name || ''
  objectEmitter.district_depature = ""
  if (city.don == '') {
    listDistrictDiemDon.value = []
  } else {
    listDistrictDiemDon.value = await cityService.getCityDetailAsync(city.don!)
  }
})
watch(() => city.tra, async () => {
  const _city = listCity.value.find((item) => item.id == city.tra)
  objectEmitter.city_diemden = _city?.name || ''
  objectEmitter.district_destination = ""
  if (city.tra == '') {
    listDistrictDiemTra.value = []
  } else {
    listDistrictDiemTra.value = await cityService.getCityDetailAsync(city.tra!)
  }
})


function isRangeSelected(duration: Duration) {
  return isSameDay(selected.value.start, sub(new Date(), duration)) && isSameDay(selected.value.end, new Date())
}

function selectRange(duration: Duration) {
  selected.value = {start: sub(new Date(), duration), end: new Date()}
}


</script>

<style></style>