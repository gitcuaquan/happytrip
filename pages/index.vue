<template>
  <UCard>
    Hi
  </UCard>
  <UTable :rows="people" />
  <UPagination v-model="page" class="mt-5" :page-count="5" :total="items.length" />
</template>

<script lang="ts" setup>


definePageMeta({
  middleware:['auth']
})

const page = ref(1)
const items = ref(Array(55))
const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  umail: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  umail: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  umail: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  umail: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  umail: 'leonard.krasner@example.com',
  role: 'Owner'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  umail: 'floyd.miles@example.com',
  role: 'Member'
}]
</script>

<style></style>