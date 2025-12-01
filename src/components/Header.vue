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
              class="hover:pb-0 p-2 relative transition-all duration-200"
              v-for="(menu, index) in filteredRoutes"
              :key="menu.path"
              :class="{
                'hover:border-b-2 hover:border-purple-400':
                  pathname !== menu.path,
                'border-b-2 border-purple-400': pathname == menu.path,
                'mr-4': index !== filteredRoutes.length - 1,
              }">
              <router-link
                :to="menu.path"
                class="transition-colors duration-200 hover:text-purple-300">
                {{ menu?.meta?.title }}
              </router-link>

              <!-- 下拉菜单：渐变背景+阴影优化 -->
              <ul
                v-if="menu.children && menu.children.length > 0"
                class="absolute top-full left-0 mt-1 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 text-white p-2 rounded-lg shadow-lg shadow-purple-500/30 min-w-[120px] transition-opacity duration-300">
                <!-- 子路由项：hover动效+选中态 -->
                <li
                  v-for="child in menu.children"
                  :key="child.name"
                  class="p-2 rounded my-1 transition-all duration-200 hover:bg-purple-700/50 hover:translate-x-1">
                  <router-link
                    :to="
                      child.path === ''
                        ? menu.path
                        : `${menu.path}/${child.path}`
                    "
                    class="block w-full"
                    :class="{
                      'font-bold text-purple-300':
                        pathname ===
                        (child.path === ''
                          ? menu.path
                          : `${menu.path}/${child.path}`),
                      'text-white':
                        pathname !==
                        (child.path === ''
                          ? menu.path
                          : `${menu.path}/${child.path}`),
                    }">
                    {{ child?.meta?.title }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>

          <div class="flex justify-end items-end">
            <a-button
              type="primary"
              size="large"
              @click="connectWebsite"
              class="rounded-full px-6 transition-transform duration-200 hover:scale-105">
              {{ address ? 'Connected' : 'Connect Wallet' }}
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
import { RouteRecordRaw, useRoute } from 'vue-router'
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
  routeState.allRoutes.value.filter(
    (v: RouteRecordRaw) => !v.path.includes(':'),
  ),
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
    // deep: true,  // 对象可以用，普通类型不用如：Number、String、Boolean 、null
    immediate: true, // onMounted会触发一次
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

// 下拉菜单显示/隐藏的过渡优化
:deep(ul > li > ul) {
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transform: translateY(8px);
}
:deep(ul > li:hover > ul) {
  opacity: 1;
  transform: translateY(0);
}
.app-logo {
  cursor: pointer;
}
</style>

