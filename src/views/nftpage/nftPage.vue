<template>
  <!--  -->
  <a-row
    class="flex w-full text-white py-[6rem] gap-10"
    style="align-items: stretch; justify-content: space-evenly">
    <a-col
      :xs="20"
      :sm="18"
      :md="14"
      :lg="10"
      :xl="10"
      :xxl="10">
      <img
        class="flex w-full h-full object-cover"
        :src="data.image"
        :alt="data.name" />
    </a-col>
    <a-col
      :xs="20"
      :sm="18"
      :md="14"
      :lg="10"
      :xl="10"
      :xxl="10"
      class="border-b-2 font-bold text-xl border p-5 w-fit shadow-lg rounded-lg space-y-8">
      <div>
        Name
        <span>
          {{ data.name }}
        </span>
      </div>

      <div>
        Description:
        <span>
          {{ data.description }}
        </span>
      </div>
      <div>
        Price:
        <span>
          {{ data.price + 'ETH' }}
        </span>
      </div>
      <div>
        Owner:
        <span class="text-sm font-medium">
          {{ data.owner }}
        </span>
      </div>
      <div>
        Seller:
        <span class="text-sm font-medium">
          {{ data.seller }}
        </span>
      </div>
      <div>
        <a-button
          type="primary"
          v-if="address !== data.owner && address !== data.seller"
          @click="buyNFT(data.tokenId)">
          Buy this NFT
        </a-button>
        <p
          v-if="address == data.owner || address == data.seller"
          class="text-emerald-700">
          {{ 'You are the owner of this NFT' }}
        </p>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers'
import Marketplace from '@/Marketplace.json'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useAccount } from '@wagmi/vue'
import { Message } from '@arco-design/web-vue'
import { INFTList, WALLET_ERROR, CHIAN_ID_ERROR, CONNECT_ERROR } from '@/market'
defineOptions({
  name: 'NftPage',
})
const { address, chainId } = useAccount()
const { success, warning, error } = Message

const data = ref<INFTList>({
  price: 0,
  tokenId: 0,
  seller: '',
  owner: '',
  image: '',
  name: '',
  description: '',
})
const route = useRoute()

const buyNFT = async (tokenId: number) => {
  // console.log('tokenId', tokenId)
  if (!window.ethereum) {
    warning(WALLET_ERROR)
    return
  }
  if (!chainId.value || !address.value) {
    warning(CONNECT_ERROR)
    return
  }
  if (chainId.value !== 31337) {
    warning(CHIAN_ID_ERROR)
    return
  }

  try {
    const priceWei = parseUnits(data.value.price.toString(), 'ether')
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(
      Marketplace.address,
      Marketplace.abi,
      await signer,
    )
    const transaction = await contract.executeSale(tokenId, {
      value: priceWei,
    })
    await transaction.wait()
    success('You successfully bought the NFT!')
    await getNFTData(tokenId)
  } catch (e: any) {
    // 详细的错误处理
    if (e.message.includes('Network Error')) {
      error('网络请求失败，请检查网络连接')
    } else if (e.message.includes('execution reverted')) {
      error('合约调用getAllNFTs方法失败，请联系管理员')
    } else {
      console.log('error', e)
      error('购买NFT失败：', +e?.message)
    }
  }
}

const getNFTData = async (tokenId: number) => {
  if (!window.ethereum) {
    warning(WALLET_ERROR)
    return
  }
  if (!chainId.value || !address.value) {
    warning(CONNECT_ERROR)
    return
  }
  if (chainId.value !== 31337) {
    warning(CHIAN_ID_ERROR)
    return
  }

  try {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    // console.log(currAddress.value)
    const contract = new Contract(
      Marketplace.address,
      Marketplace.abi,
      await signer,
    )
    const transaction = (await contract.getListedTokenForId(tokenId)) as any[]
    const tokenURI = await contract.tokenURI(tokenId)
    const tokenJSON = await axios.get(tokenURI)

    const items = {
      price: Number(formatUnits(transaction[3], 'ether')) || 0,
      tokenId: parseInt(transaction[0]) || 0,
      seller: transaction[2],
      owner: transaction[1],
      image: tokenJSON.data.image,
      name: tokenJSON.data.name,
      description: tokenJSON.data.description,
    }
    // console.log(items, 'items')
    data.value = items as INFTList
  } catch (e: any) {
    // 详细的错误处理
    if (e.message.includes('Network Error')) {
      error('网络请求失败，请检查网络连接')
    } else if (e.message.includes('execution reverted')) {
      error('合约调用getAllNFTs方法失败，请联系管理员')
    } else {
      error('NFT失败：', +e.message)
    }
  }
}

onMounted(async () => {
  try {
    const tokenId = route.params
      ? ((await route.params.tokenId) as string)
      : null
    console.log('tokenId', tokenId, typeof tokenId)
    if (tokenId) {
      await getNFTData(Number(tokenId))
    }
    // 原mounted中的逻辑
  } catch (error) {
    console.error('mounted阶段错误:', error)
  }
})
</script>
