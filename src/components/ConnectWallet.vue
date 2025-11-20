<template>
  <!-- <a-button @click="handleClick">Open Modal</a-button> -->
  <a-modal
    v-model:visible="visible"
    width="400px"
    @cancel="handleCancel"
    hideCancel
    :closable="false"
    :footer="false"
    :modalStyle="{ 'background-color': 'blueviolet' }"
    modalClass="connect-modal">
    <template #title>
      <div class="flex w-full items-center justify-between bg-block/50">
        <h1
          class="flex-1 h-[1.875rem] text-white ml-2 font-bold text-sm leading-[1.875rem]">
          Connect your wallet
        </h1>
        <div
          @click="handleCancel"
          class="w-fit h-[1.875rem] flex items-center justify-center cursor-pointer hover:bg-slate-400 rounded-lg border-b-2 border-e-red-50">
          <icon-close
            style="color: #ffffff"
            :size="30" />
        </div>
      </div>
    </template>
    <div class="h-[calc(90vh-8rem)] w-full pb-4">
      <ul
        class="w-full h-fit flex flex-col mb-4 gap-4 items-center text-xl font-medium text-gray-600 p-2 px-2">
        <li
          class="h-[4rem] flex rounded-lg bg-violet-500 text-white hover:bg-[rgba(0,0,0,0.3)] w-full justify-between items-between p-4 cursor-pointer"
          v-for="connector in connectors"
          @click="handleConnect(connector, chainId)"
          :key="connector.id">
          <div class="w-fit h-full flex items-center">
            <img
              :src="connector.icon || imgMap[connector.type]"
              :alt="connect.name"
              class="w-10 h-10 rounded-[0.5rem]" />
          </div>
          <div class="w-fit h-full flex items-center">
            {{ connector.name }}
          </div>
        </li>
      </ul>
      <div class="pl-2">
        <span
          class="text-white"
          v-if="status">
          {{ '钱包状态: ' + status }}
        </span>
        <br />
        <span
          class="text-red-400"
          v-if="error?.message">
          {{ '钱包报错: ' + error?.message }}
        </span>
      </div>
    </div>
  </a-modal>
  <!-- <div class="border border-b-2 w-[400px] ml-4 rounded-[2rem]">
       

    </div> -->
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
console.log('imgModules', imgModules)
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
  (map: any, [path, module]) => {
    // const imgName = map[0].match(/[^/]+(?=\.\w+$)/) as any[];
    // 从路径中提取图片名称（如 one.webp → one）
    const imgName = path.match(/wallet\/(.*?)\.(webp|png)/)?.[1]
    console.log('imgName', imgName, path)
    if (imgName) {
      map[imgName] = module
    }
    return map
  },
  {} as Record<string, any>,
)
console.log('imgMap', imgMap)

console.log('connect', connectors, connect)
const visible = ref<boolean>(false)

// 定义触发cancel事件的方法（例如点击“取消”按钮时调用）
const handleCancel = () => {
  emit('update:cancel') // 触发cancel事件，父组件可监听并响应
}

const handleConnect = (connector: any, chainId: number | undefined) => {
  connect({ connector, chainId })
  handleCancel()
}
watch(
  () => props.digVisible,
  (val: boolean) => {
    if (val) {
      visible.value = true
    } else {
      visible.value = false
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>
<style lang="scss" scoped></style>
