<script setup lang="ts">
const thisRole = ref('admin')

const menu1 = [
  {
    label: "Trang chủ",
    icon: "i-heroicons-home",
    role: ['admin']
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
    icon: "i-heroicons-bookmark-square"
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
const thisMenu = computed(() => menu.value.filter(item => item.role?.includes(thisRole.value)))
</script>

<template>
  <div class="flex">
    <div class="w-64  sticky top-0 md:flex hidden flex-col overflow-auto h-screen border-e-2">
      <img src="https://happytrip.vn/img/logohpt.png" class="mx-auto my-2" width="150" alt="">
      <template v-for="item in menu1">
        <UButton v-if="item?.role?.includes(thisRole)" :label="item.label" :icon="item.icon" :to="item.to"
          variant="ghost"></UButton>
      </template>
      <UAccordion default-open multiple color="black" :items="thisMenu" variant="ghost">
        <template #default="{ item, index, open }">
          <UButton variant="ghost" :to="item.to">
            <template #leading>
              <UIcon :name="item.icon" class="w-5 h-5" dynamic />
            </template>
            {{ item.label }}
            <template #trailing>
              <UIcon v-if="item.childern" name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200" :class="[open && 'rotate-90']" />
            </template>
          </UButton>
        </template>
        <template #item="{ item }">
          <UVerticalNavigation :links="item.childern" />
        </template>
      </UAccordion>
    </div>
    <div class="w-full">
      <header class="bg-white shadow-sm sticky flex top-0 w-full px-2 py-2">
        <UTooltip text="Đăng xuất" class="ms-auto me-2">
          <UButton variant="ghost" icon="i-heroicons-arrow-left-start-on-rectangle">
          </UButton>
        </UTooltip>
        <UPopover  mode="hover">
          <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4"></UAvatar>

          <template #panel="{ close }">
            <div class="p-3 ">
              <UButton label="Close" @click="close" />
            </div>
          </template>
        </UPopover>
      </header>
      <div class="p-2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
