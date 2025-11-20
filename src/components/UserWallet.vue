<template>
    <!-- <a-button @click="handleClick">Open Modal</a-button> -->
    <a-modal v-model:visible="visible" width="400px" @cancel='handleCancel' hideCancel :closable="false" :footer="false"
        :modalStyle="{ 'background-color': 'blueviolet' }" modalClass="connect-modal">
        <template #title>
            <div class="flex w-full items-center justify-between bg-block/50">
                <div class="flex-1 h-[1.875rem] text-white ml-2 font-bold text-sm leading-[1.875rem] ">
                    <a-dropdown @select="handleSelect" style="width: 13rem;background-color: rgba(0, 0, 0, 0.5)">
                        <a-button style="width: 13rem;background: rgba(0, 0, 0, 0.5);color:wheat">{{
                            currentNetWork?.name }}</a-button>
                        <template #content>
                            <a-doption v-for="network in netWorkChain" :value="network.id" :key="network.id" :style="{
                                'background-color': currentNetWork?.id == network.id ? '#451571' : 'rgba(0, 0, 0, 0.9)',
                                color: currentNetWork?.id == network.id ? 'white' : '#ccc'
                            }">{{
                                network.name }}</a-doption>
                        </template>
                    </a-dropdown>
                </div>
                <div @click="handleCancel"
                    class="w-fit h-[1.875rem]  flex items-center justify-center cursor-pointer  hover:bg-slate-400 rounded-lg">
                    <icon-close style="color:#fff" :size="30" />
                </div>
            </div>
        </template>
        <div class="h-[calc(90vh-8rem)] w-full pb-4">
            <div class="flex flex-col w-full pb-4 items-center gap-3 ">
                <div class="flex ">
                    <a-avatar :size="100">
                        <img alt="avatar" src="/tou.webp" />
                    </a-avatar>
                </div>
                <div class="flex  items-center">
                    <span class="font-bold text-base text-white">
                        {{ addressText }}
                    </span>
                    <span
                        class="p-2 rounded-[50%] ml-2  cursor-pointer hover:bg-gray-400 inline-flex items-center justify-center">
                        <icon-copy :size="20" class="w-12 h-12  rounded-[50%]" @click="copyAddress"
                            style="color:wheat" />
                    </span>

                </div>
                <div class="font-[500] text-white flex items-center ">
                    {{ value }} {{ symbol }}
                </div>
            </div>

            <div
                class="min-w-[100%] h-fit flex flex-col mb-4 gap-4 items-center text-xl mt-12  font-medium text-gray-600 p-2">
                <button
                    class="h-[4rem] flex rounded-lg bg-violet-500 text-white hover:bg-[rgba(0,0,0,0.3)]  w-full  items-between p-4 cursor-pointer">

                    <div class="w-fit h-full flex items-center">
                        <icon-schedule :size="30" color="white" class="w-10 h-10 rounded-[0.5rem]" />
                    </div>
                    <div class="w-fit h-full flex items-center ml-12">
                        {{ 'Activity' }}
                    </div>
                </button>
                <button v-if="status == 'connected'"
                    class="h-[4rem] flex rounded-lg bg-violet-500 text-white hover:bg-[rgba(0,0,0,0.3)]  w-full  items-between p-4 cursor-pointer"
                    @click="disConnect()">

                    <div class="w-fit h-full flex items-center">
                        <icon-export :size="30" color="white" class="w-10 h-10 rounded-[0.5rem]" />
                    </div>
                    <div class="w-fit h-full flex items-center  ml-12">
                        {{ 'Disconnect' }}
                    </div>
                </button>

            </div>
            <!-- <div class="pl-2">
                <span class="text-white" v-if="status">
                    {{ '钱包状态: ' + status }}
                </span>
                <br />
                <span class="text-red-400" v-if="error?.message">
                    {{ '钱包报错: ' + error?.message }}
                </span>

            </div> -->
        </div>

    </a-modal>
    <!-- <div class="border border-b-2 w-[400px] ml-4 rounded-[2rem]">
       

    </div> -->
</template>
<script lang="ts" setup>
// import useModalStore from '@/store/modal';
import {watch,computed} from 'vue';
import { useAccount, useBalance, useDisconnect, useSwitchChain } from '@wagmi/vue';
import { netWorkChain, } from '@/wagmi';
import { formatUserAddress, roundNumber } from '@/market';
import { Message } from '@arco-design/web-vue';
import { formatUnits } from 'viem';



defineOptions({
    name: 'UserWallet',
})


const { address, status, chainId } = useAccount();
console.log('userStatus', status.value)
const { disconnect } = useDisconnect()
console.log('chainId', chainId.value);
console.log('chainId', address.value);
const currentNetWork = computed(() => netWorkChain.find((x) => x.id == chainId.value))
console.log('currentNetWork', currentNetWork.value)
const { data: balance } = useBalance({ address });
// map balance data to symbol and value (formatted)
const symbol = computed(() => balance.value?.symbol ?? 'ETH');
const value = computed(() => {
    const raw = formatUnits(balance.value?.value ?? 0n, 18);
    const num = Number(raw);
    return Number.isFinite(num) ? roundNumber(num, 3) : '0.00';
});

const emit = defineEmits(['update:cancel'])
const props = defineProps({
    digVisible: {
        type: Boolean,
        default: false,
    }
})
const addressText = computed(() => formatUserAddress(address.value as string || ''))

const { switchChain } = useSwitchChain();
const visible = ref<boolean>(false);


// 定义触发cancel事件的方法（例如点击“取消”按钮时调用）
const handleCancel = () => {
    emit('update:cancel'); // 触发cancel事件，父组件可监听并响应
};
const copyAddress = async () => {
    try {
        await navigator.clipboard.writeText(address.value || '');
        Message.success('Address copied');
    } catch (error: any) {
        Message.error('error: ' + error?.message)
    }
}
const disConnect = async () => {
    await disconnect();
    handleCancel();
}


const handleSelect = async (v: string | number) => {
    if (v && switchChain) {
        try {
            const chainId = typeof v === 'string' ? Number(v) : v;
            if (!Number.isNaN(chainId)) {
                await switchChain({ chainId });
                console.log('v', v)
            } else {
                console.warn('invalid chain id', v);
            }
        } catch (err: any) {
            Message.error('switchChain error:' + err?.message);
        }
    }
};
watch(() => props.digVisible, (val: boolean) => {
    if (val) {
        visible.value = true;
    } else {
        visible.value = false;
    }
}, {
    // deep: true,
    immediate: true
})


</script>
<style lang="scss" scoped>
:global(.arco-dropdown) {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>