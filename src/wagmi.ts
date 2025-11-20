
import { Config, createConfig, createStorage, http } from '@wagmi/vue';
import { base, bscTestnet, Chain, mainnet, optimism, sepolia } from '@wagmi/vue/chains';
import { coinbaseWallet, walletConnect } from '@wagmi/vue/connectors';

const chains: Chain[] = [
    //本地链配置
    {
        id: 31337, // 本地链默认chaid为31337
        name: 'Localhost',
        nativeCurrency: {
            name: 'Goerli Ether',
            symbol: 'GO',
            decimals: 18
        },
        rpcUrls: {
            default: {
                http: ['http://127.0.0.1:8545/']
            }
        }, // 本地链RPC地址
        blockExplorers: {
            default: {
                name: 'Hardhat',
                url: 'https://bscscan.com'
            }
        },
        testnet: true,
    },
    bscTestnet, // BSC测试链（viem内置，直接导入）
] as const;

export const netWorkChain = [mainnet, sepolia, optimism, base, ...chains];
export const config: Config = createConfig({
    chains: [mainnet, sepolia, optimism, base, ...chains],
    connectors: [
        walletConnect({
            projectId: 'ab33b4aa75de1fdb5ed5560142251151',
        }),
        coinbaseWallet({ appName: 'Vite Vue Playground', darkMode: false }),
        // metaMask(),
        // injected(),


        // safe(),

    ],
    storage: createStorage({ storage: localStorage, key: 'vite-vue' }),
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [optimism.id]: http(),
        [base.id]: http(),
         [31337]: http('http://127.0.0.1:8545'), // 本地链RPC
        [bscTestnet.id]: http(import.meta.env.VITE_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'),
    },

});


// useWagmi封装不变
// export function useWagmi() {
//     const { connect, connectors, connectAsync } = useConnect({
//         config: config,
//     });

//     const { disconnect } = useDisconnect({ config: config });
//     const { address, isConnected, chainId } = useAccount({
//         config: config,
//     });// 新增chainId，方便判断当前链

//     return {
//         disconnect,
//         connect,
//         connectors,
//         connectAsync,
//         address,
//         isConnected,
//         chainId,
//     }
// }

