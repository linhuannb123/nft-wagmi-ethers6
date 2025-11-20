<template>
  <div>
    <div class="w-full">
      <a-row
        justify="space-between"
        align="center"
        wrap
        class="bg-transparent pr-5 py-3 text-white">
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="10"
          :xl="6"
          :xxl="6">
          <router-link
            to="/"
            class="flex flex-row items-end app-logo ml-5 pb-2">
            <img
              src="./full_logo.png"
              alt="NFT Marketplace"
              width="120"
              height="120"
              class="inline-block -mt-2" />
            <div class="inline-block font-bold text-xl ml-2">
              NFT Marketplace
            </div>
          </router-link>
        </a-col>
        <a-col
          class="flex flex-row items-center justify-evenly"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="14"
          :xl="10"
          :xxl="6">
          <ul class="flex font-[500] text-xl">
            <li
              class="hover:pb-0 p-2"
              v-for="(menu, index) in filteredRoutes"
              :key="menu.path"
              :class="{
                'hover:border-b-2': pathname !== menu.path,
                'border-b-2': pathname == menu.path,
                'mr-4': index !== filteredRoutes.length - 1,
              }">
              <router-link :to="menu.path">
                {{ menu.meta.title }}
              </router-link>
            </li>
          </ul>
          <div class="flex justify-end items-end">
            <a-button
              type="primary"
              @click="connectWebsite"
              size="large">
              {{ status === 'connected' ? 'Connected' : 'Connect Wallet' }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="text-white flex justify-end text-lx text-right mr-20">
      {{ addressText }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeState } from '@/router'
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { formatAddress } from '@/market'
import { useAccount } from '@wagmi/vue'
import useModalStore from '@/store/modal'

defineOptions({
  name: 'Header',
})

const modalStore = useModalStore()
const route = useRoute()
const filteredRoutes = computed(() =>
  routeState.visibleRoutes.value.filter((v) => !v.path.includes('tokenId')),
)
// const filteredRoutes = computed(() => routeState.visibleRoutes.value);
const pathname = computed(() => route.path)

// console.log(pathname)
// const btnBg = ref<string>('rgb(34, 197, 94)')
// const hoverBg = ref<string>('rgb(29, 78, 216)')
// 修改网络id  localhost 0x7a69 bscTest  0x61
// const usedChainId = ref<string>('0x7a69')
const { chainId, address, status } = useAccount()
console.log('chainId', chainId.value, address.value, status.value)

// connecting disconnected
// 连接状态
// const connected = computed(() => status.value === 'connecting')
// console.log('connected',connected.value)
const addressText = computed(() => formatAddress(address.value || ''))
// 切换按钮样式
// const updateButton = (bool: boolean) => {
//   if (bool) {
//     connected.value = true
//     btnBg.value = 'rgb(29, 78, 216)'
//     hoverBg.value = 'rgb(34, 197, 94)'
//   } else {
//     connected.value = false
//     btnBg.value = 'rgb(34, 197, 94)'
//     hoverBg.value = 'rgb(29, 78, 216)'
//   }
// }

// const { open } = useAppKit();
// 连接钱包
const connectWebsite = async () => {
  if (status.value == 'connected') {
    console.log('status', status.value)
    modalStore.openUserLogin()
  } else {
    modalStore.openModal()
  }
}

watch(
  () => address.value,
  () => {
    console.log('value', address.value)
  },
  {
    // deep: true,
    immediate: true,
  },
)
</script>
<style scoped lang="scss">
:deep(.arco-btn-primary[type='button']) {
  font-weight: 500;
  background: rgb(34 197 94);
  border-radius: 0.25rem;

  // margin-right: 1rem;
  &:hover {
    background: rgb(29 78 216);
  }
}
.app-logo {
  // pointer-events: none;
  cursor: pointer;
}
</style>
