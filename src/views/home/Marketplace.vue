<template>
  <div class="h-1/2 w-full text-white text-lg flex flex-col justify-center items-center pt-20">
    <div class="flex flex-row justify-center items-center pt-2 text-lg font-bold">
      Top NFTs
    </div>

    <a-spin :loading="loading" tip="loading..." v-if="loading" />

    <div class="w-full flex justify-center flex-wrap warpple-class">
      <template v-for="value in data" :key="value.tokenId">
        <NftTitle :data="value" class="pb-2" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAccount } from '@wagmi/vue';
import Marketplace from '@/Marketplace.json'
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import axios from 'axios'
import { INFTList, WALLET_ERROR, CHIAN_ID_ERROR, CONNECT_ERROR } from '@/market'
import { Message } from '@arco-design/web-vue'

defineOptions({
  name: 'Marketplace',
})
const data = ref<INFTList[]>([])

const { address,chainId } = useAccount();
const { success, warning, error } = Message
const loading = ref<boolean>(false)
const getAllNFTs = async () => {
  // 1.状态重置：清空旧数据
  data.value = [];
  // 在函数开头增加一个守卫，防止不必要的执行
  if (loading.value) {
    return;
  }

  if (!window.ethereum) {
    warning(WALLET_ERROR)
    return;
  }
  if (!chainId.value|| !address.value) {
    warning(CONNECT_ERROR)
    return;
  }
  if (chainId.value !== 31337) {
    warning(CHIAN_ID_ERROR)
    return;
  }
  try {
    loading.value = true
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(
      Marketplace.address,
      Marketplace.abi,
      await signer,
    )
    const transaction = await contract.getAllNFTs();
    const items = await Promise.all(
      transaction.map(async (i: any[]) => {
        const tokenURI = await contract.tokenURI(i[0])
        const pinataJson = await axios.get(tokenURI)

        const item = {
          price: formatUnits(i[3], 'ether'),
          tokenId: Number(i[0]),
          seller: i[2],
          owner: i[1],
          image: pinataJson.data.image,
          name: pinataJson.data.name,
          description: pinataJson.data.description,
        }
        return item
      }),
    )
    data.value = items
    // console.log('transaction', items)
    success(`成功加载 ${items.length} 个 NFT 数据`)
    loading.value = false
  } catch (e: any) {
    // 详细的错误处理
    if (e.message.includes('Network Error')) {
      error('网络请求失败，请检查网络连接');
    } else if (e.message.includes('execution reverted')) {
      error('合约调用getAllNFTs方法失败，请联系管理员')
    } else {
      error('加载 NFT 数据失败：' + e.message)
    }


  } finally {
    loading.value = false;
  }
}
watch(() => [chainId.value, address.value],
  async (newValue) => {
    const [newChainId, newAddress] = newValue
    // 未连接/连接无效；提示清空数据，不执行后续逻辑
    if (!newChainId || !newAddress) {
      data.value = [];
      warning(CONNECT_ERROR)
      return;
    }

    // 链ID非法，提示并清空数据
    if (newChainId !== 31337) {
      data.value = [];
      warning(CHIAN_ID_ERROR);
      return;
    }
    console.log('状态变化，重新获取 NFT 数据');
    await getAllNFTs()

  }, {
  // deep: true,  // 如果监听的是对象，需要 deep: true，但这里是基本类型，不需要
  immediate: true, // 组件挂载后立即执行一次
})


</script>
<style scoped lang="scss">
:deep(.arco-link) {
  &:hover {
    background-color: transparent;
  }
}

:deep(.warpple-class) {
  a {
    div {
      padding-bottom: 0.5rem;
    }
  }
}
</style>
