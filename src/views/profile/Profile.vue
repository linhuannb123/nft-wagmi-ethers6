<template>
  <div class="flex flex-col text-white w-full pt-11">
    <a-row align="center" justify="center" class="md:text-2xl text-center text-lg font-bold">
      <h2>
        {{ 'Wallet Address' }}
      </h2>
    </a-row>

    <a-row class="mt-2 md:text-2xl text-center text-lg font-[500]">
      <a-col :span="24">
        {{ currAddress }}
      </a-col>
    </a-row>
    <a-row align="center" justify="center" class="mt-[4rem] md:text-2xl text-center text-lg font-bold">
      <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
        {{ 'No. of NFTs' }}
      </a-col>
      <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
        {{ 'Total Value' }}
      </a-col>
    </a-row>
    <a-row align="center" justify="center" class="mt-2 text-center md:text-2xl text-lg font-[500]">
      <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
        {{ data.length }}
      </a-col>
      <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
        {{ nftTotalPrice == 0 ? '0.00' + 'ETH' : nftTotalPrice + 'ETH' }}
      </a-col>
    </a-row>
    <a-row align="center" justify="center" class="mt-[2.6rem] text-center md:text-2xl text-lg font-bold">
      <a-col :span="24">
        {{ 'Your NFTs' }}
      </a-col>
    </a-row>
    <a-row align="center" justify="center" wrap class="text-center md:text-2xl text-lg font-[500]">
      <template v-if="data.length">
        <template v-for="item in data" :key="item.tokenId">
          <NftTitle :data="item" />
        </template>
      </template>
      <p v-if="data.length == 0" class="mt-12">
        {{ 'Oops, No NFT data to display (Are you logged in?)' }}
      </p>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import NftTitle from '@/components/NftTitle.vue'
import Marketplace from '@/Marketplace.json'
import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import { useAccount } from '@wagmi/vue'
import { INFTList, sumPriceArray, WALLET_ERROR, CHIAN_ID_ERROR, CONNECT_ERROR } from '@/market'
import { ref, computed, watch } from "vue"
defineOptions({
  name: 'Profile',
})
const { address, chainId } = useAccount();
const { success, warning, error } = Message

const currAddress = computed(() => address.value || '0x')
const nftTotalPrice = ref<number>(0)
const data = ref<INFTList[]>([])
const getList = async () => {
  nftTotalPrice.value = 0
  data.value = []
  if (!window.ethereum) {
    warning(WALLET_ERROR)
    return;
  }
  if (!chainId.value || !address.value) {
    warning(CONNECT_ERROR)
    return;
  }
  if (chainId.value !== 31337) {
    warning(CHIAN_ID_ERROR)
    return;
  }

  let sumPrice = 0
  const numberArr: number[] = []
  try {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const contract = new Contract(
      Marketplace.address,
      Marketplace.abi,
      await signer,
    )
    //
    const transaction = await contract.getMyNFTs()
    // console.log('transaction', transaction)
    const items = await Promise.all(
      transaction.map(async (i: any[]) => {
        const tokenURI = await contract.tokenURI(Number(i[0]))
        const tokenJSON = await axios.get(tokenURI)
        const item = {
          price: Number(formatUnits(i[3], 'ether')),
          tokenId: Number(i[0]),
          seller: i[2],
          owner: i[1],
          image: tokenJSON.data.image,
          name: tokenJSON.data.name,
          description: tokenJSON.data.description,
        }
        numberArr.push(Number(formatUnits(i[3], 'ether')) as number)
        return item
      }),
    )
    sumPrice = sumPriceArray(numberArr)
    data.value = items
    nftTotalPrice.value = sumPrice
    console.log('items', items, sumPrice)
    success('You successfully My List NFT!')
  } catch (e: any) {
    // 详细的错误处理
    if (e.message.includes('Network Error')) {
      error('网络请求失败，请检查网络连接');
    } else if (e.message.includes('execution reverted')) {
      error('合约调用getAllNFTs方法失败，请联系管理员')
    } else {
      error('加载NFT列表失败：' + e.message)
    }
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
    await getList()

  }, {
  // deep: true,  // 如果监听的是对象，需要 deep: true，但这里是基本类型，不需要
  immediate: true, // 组件挂载后立即执行一次
})

</script>
