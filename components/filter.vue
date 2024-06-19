<template>
  <div class="flex p-2 border rounded gap-2">
    <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
      placeholder="Tìm kiếm từ khóa..." />
    <UDivider orientation="vertical" />
    <USelectMenu v-model="selectedCity" :ui="{ base: 'w-36' }" :ui-menu="{ width: 'w-36' }" :options="listCity"
      placeholder="Thành phố" value-attribute="id" option-attribute="name" />
    <USelectMenu v-model="selectedDistrict" :ui="{ base: 'w-36' }" :ui-menu="{ width: 'w-36' }"
      :options="listCityDetail?.districts" placeholder="Quận huyện" value-attribute="name" option-attribute="name" />
    <UDivider orientation="vertical" />
  </div>
</template>

<script lang="ts" setup>
import { CityService, type City, type CityDetails } from '~/services/CityService';

const { parameters, bodyFilter } = useFilter();

const cityService = new CityService();
const listCity = ref<City[]>([]);
const selectedCity = ref("");
const selectedDistrict = ref("");
let listCityDetail = ref<CityDetails>();

onMounted(async () => {
  parameters.limit = 250;
  parameters.fields = "id,name,code";
  listCity.value = await cityService.getCityAsync(parameters, {});
})
watch(() => selectedCity.value, async () => {
  listCityDetail.value = await cityService.getCityDetailAsync(selectedCity.value)
})


</script>

<style></style>