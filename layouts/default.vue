<script setup lang="ts">

const ROLE = {
  ADMIN: 'admin',
  PARTNER: 'partner',
  AFFILATE: 'affilate'
}
const user = useUser();
const thisRole = ref(user.value.tokenType.toLowerCase())

const menu1 = [
  {
    label: "Trang chủ",
    icon: "i-heroicons-home",
    to: "/",
    role: [ROLE.ADMIN, ROLE.PARTNER, ROLE.AFFILATE],
  },
  {
    label: "Quản lý tài xế",
    icon: "i-heroicons-user-group"
  },
  {
    label: "Bảng giá",
    icon: "i-heroicons-clipboard-document-list"
  },
  {
    label: "Khách hàng",
    icon: "i-heroicons-user"
  },
  {
    label: "Quản lý ví tiền",
    icon: "i-heroicons-wallet"
  },
  {
    label: "Quản lý hãng xe",
    icon: "i-heroicons-lifebuoy"
  },
  {
    label: "Quản lý cộng tác viên",
    icon: "i-heroicons-users"
  },
  {
    label: "Cài đặt tỉnh thành",
    icon: "i-heroicons-wrench-screwdriver"
  },
  {
    label: "Đơn hàng chưa tài xế",
    to: "/don-hang-chua-tai-xe",
    icon: "i-heroicons-bookmark-square",
    role: [ROLE.PARTNER],
  }
]

const menu = ref([

  {
    label: 'Quản lý lệnh rút tiền',
    icon: 'i-heroicons-currency-euro',
    role: ['admin'],
    childern: [
      {
        label: "Lệnh chờ",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Hoàn thành",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Hủy lệnh",
        icon: "i-heroicons-clipboard"

      }
    ]
  },
  {
    label: 'Quản lý chuyển đi',
    icon: "i-heroicons-truck",
    role: ['admin'],
    childern: [
      {
        label: "Chờ tài xế",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Đã nhận đơn",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Hủy chuyến",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Lệnh hủy chuyến",
        icon: "i-heroicons-clipboard"
      }
    ]
  },
  {
    label: 'Đơn hàng đã nhận',
    icon: "i-heroicons-truck",
    role: [ROLE.PARTNER],
    childern: [
      {
        label: "Chờ tài xế",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Đã nhận đơn",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Hủy chuyến",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Lệnh hủy chuyến",
        icon: "i-heroicons-clipboard"
      }
    ]
  },
  {
    label: 'Đơn hàng ký gửi',
    icon: "i-heroicons-truck",
    role: [ROLE.PARTNER],
    childern: [
      {
        label: "Chờ tài xế",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Đã nhận đơn",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Hủy chuyến",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Lệnh hủy chuyến",
        icon: "i-heroicons-clipboard"
      }
    ]
  },
  {
    label: 'Ví tiền',
    role: [ROLE.PARTNER],
    icon: "i-heroicons-truck",
    childern: [
      {
        label: "Chờ tài xế",
        icon: "i-heroicons-clipboard"
      },
      {
        label: "Đã nhận đơn",
        icon: "i-heroicons-clipboard"
      }
    ]
  },
])
const isOpen = ref(false)
const thisMenu = computed(() => menu.value.filter(item => item.role?.includes(thisRole.value)))
</script>

<template>
  <USlideover v-model="isOpen">
    <UCard class="flex flex-col flex-1"
           :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
                 class="flex sm:hidden absolute end-2 top-3 z-10" square padded @click="isOpen = false"/>
        <img src="https://happytrip.vn/img/logohpt.png" class="me-auto" width="150" alt="">
      </template>

      <div class=" flex flex-col">
        <template v-for="item in menu1">
          <UButton v-if="item?.role?.includes(thisRole)" :label="item.label" :icon="item.icon" :to="item.to"
                   variant="ghost"></UButton>
        </template>
        <UAccordion default-open multiple color="black" :items="thisMenu" variant="ghost">
          <template #default="{ item, index, open }">
            <UButton variant="ghost" :to="item.to">
              <template #leading>
                <UIcon :name="item.icon" class="w-5 h-5" dynamic/>
              </template>
              {{ item.label }}
              <template #trailing>
                <UIcon v-if="item.childern" name="i-heroicons-chevron-right-20-solid"
                       class="w-5 h-5 ms-auto transform transition-transform duration-200"
                       :class="[open && 'rotate-90']"/>
              </template>
            </UButton>
          </template>
          <template #item="{ item }">
            <UVerticalNavigation class="ms-3" :links="item.childern"/>
          </template>
        </UAccordion>
      </div>
    </UCard>
  </USlideover>
  <div class="grid-container">
    <header style="z-index: 9;" class="bg-white header shadow-sm sticky flex top-0 w-full px-2 py-2">
      <UButton @click="isOpen = true" class="md:hidden" variant="outline">
        <u-icon name="i-ic-outline-menu" class="text-xl" dynamic></u-icon>
      </UButton>
      <img src="https://happytrip.vn/img/logohpt.png" class="mx-auto md:hidden my-2" width="150" alt="">
      <UPopover mode="hover" class="md:ms-auto">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4"></UAvatar>
        <template #panel="{ close }">
          <div class="p-3 ">
            {{ user.fullName }}
          </div>
        </template>
      </UPopover>
    </header>
    <div style="min-width: 250px;"
         class=" sticky  menu top-0 md:flex hidden flex-col overflow-auto h-screen border-e-2">
      <img src="https://happytrip.vn/img/logohpt.png" class="mx-auto my-2" width="150" alt="">
      <template v-for="item in menu1">
        <UButton v-if="item?.role?.includes(thisRole)" :label="item.label" :icon="item.icon" :to="item.to"
                 variant="ghost"></UButton>
      </template>
      <UAccordion default-open multiple color="black" :items="thisMenu" variant="ghost">
        <template #default="{ item, index, open }">
          <UButton variant="ghost" :to="item.to">
            <template #leading>
              <UIcon :name="item.icon" class="w-5 h-5" dynamic/>
            </template>
            {{ item.label }}
            <template #trailing>
              <UIcon v-if="item.childern" name="i-heroicons-chevron-right-20-solid"
                     class="w-5 h-5 ms-auto transform transition-transform duration-200"
                     :class="[open && 'rotate-90']"/>
            </template>
          </UButton>
        </template>
        <template #item="{ item }">
          <UVerticalNavigation class="ms-3" :links="item.childern"/>
        </template>
      </UAccordion>
    </div>
    <div class="main p-3">
        <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.header {
  grid-area: header;
}

.menu {
  grid-area: menu;
}

.main {
  grid-area: main;
}

.grid-container {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr 1fr 1fr;
  grid-template-areas:
    'menu header header header'
    'menu main main main'
}
</style>
