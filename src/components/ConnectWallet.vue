<template>
  <a-modal
    v-model:visible="visible"
    width="400px"
    @cancel="handleCancel"
    hideCancel
    :closable="false"
    :footer="false"
    :modalStyle="{ 'background-color': '#9333EA' }"
    modalClass="connect-modal">
    <template #title>
      <div class="flex w-full items-center justify-between">
        <h1 class="text-white ml-2 font-bold text-sm">Connect your wallet</h1>
        <div
          @click="handleCancel"
          class="w-fit h-[1.875rem] flex items-center justify-center cursor-pointer hover:bg-slate-400/30 rounded-lg transition-all duration-200">
          <icon-close
            style="color: #ffffff"
            :size="24" />
        </div>
      </div>
    </template>
    <div class="h-[calc(90vh-8rem)] w-full pb-4">
      <ul class="w-full h-fit flex flex-col mb-4 gap-2 items-center p-2 px-2">
        <li
          class="wallet-item h-[3.5rem] flex rounded-lg w-full justify-start items-center p-4 cursor-pointer transition-all duration-200"
          v-for="connector in connectors"
          @click="handleConnect(connector, chainId)"
          :key="connector.id">
          <div
            class="w-8 h-8 rounded-[0.5rem] mr-4 flex items-center justify-center">
            <img
              :src="connector.icon || imgMap[connector.type]"
              :alt="connector.name"
              class="w-full h-full object-contain" />
          </div>
          <div class="text-white font-medium">
            {{ connector.name }}
          </div>
        </li>
      </ul>
      <div class="pl-4 text-white text-sm">
        <span v-if="status">钱包状态: {{ status }}</span>
        <br />
        <span
          class="text-red-400"
          v-if="error?.message">
          钱包报错: {{ error?.message }}
        </span>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { useChainId, useConnect } from '@wagmi/vue'
import { watch, ref } from 'vue'

defineOptions({
  name: 'ConnectWallet',
})

const imgModules = import.meta.glob('@/assets/images/wallet/*.(webp|png)', {
  eager: true,
  import: 'default',
})

const chainId = useChainId()
const { connectors, connect, error, status } = useConnect()
const emit = defineEmits(['update:cancel'])
const props = defineProps({
  digVisible: {
    type: Boolean,
    default: false,
  },
})

const imgMap = Object.entries(imgModules).reduce(
  (map: Record<string, any>, [path, module]) => {
    const imgName = path.match(/wallet\/(.*?)\.(webp|png)/)?.[1]
    if (imgName) map[imgName] = module
    return map
  },
  {},
)

const visible = ref<boolean>(false)

const handleCancel = () => {
  emit('update:cancel')
}

const handleConnect = (connector: any, chainId: number | undefined) => {
  connect({ connector, chainId })
  handleCancel()
}

watch(
  () => props.digVisible,
  (val: boolean) => {
    visible.value = val
  },
  {
    // deep: true,  // 对象可以用，普通类型不用如：Number、String、Boolean 、null
    immediate: true, // onMounted会触发一次
  },
)
</script>

<style lang="scss" scoped>
.connect-modal {
  background-color: #9333ea;
  border-radius: 8px;
}
.wallet-item {
  color: #ffffff;
  background-color: #8b5cf6; /* 调整后的默认色，更突出 */
  border: 1px solid rgb(255 255 255 / 20%); /* 轻微描边 */
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%); /* 轻微阴影 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: #7e22ce; /* 你喜欢的hover深色 */
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%); /* 阴影加深 */
    transform: translateX(2px);
  }
  &:active {
    background-color: #7026c5;
    box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
    transform: translateX(0);
  }
}

// // 标题栏与弹窗融合
// ::v-deep(.ant-modal-header) {
//   background-color: #9333EA;
//   border-bottom: 1px solid #A855F7;
//   padding: 12px 16px;
// }

// 关闭按钮优化
div[class*='cursor-pointer'] {
  &:hover {
    background: rgb(100 116 139 / 30%);
    transform: scale(1.05);
  }
}
</style>
