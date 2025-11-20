

import { mainnet, polygon, base, type AppKitNetwork } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

export const projectId = import.meta.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost
if (!projectId) {
    throw new Error('VITE_PROJECT_ID is not set')
}


export const localhostNetwork: AppKitNetwork = {
    id: 31337,
    sourceId: 1, // 修正为纯十六进制bscMainNetwork
    name: 'Localhost',
    nativeCurrency: {
        name: 'Goerli Ether',
        symbol: 'GO',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545/'] },
    },
    blockExplorers: {
        default: { name: 'Hardhat', url: 'https://bscscan.com' },
    },
    assets: {
        imageId: 'localhost',
        imageUrl: 'https://picsum.photos/40/40?random=2',
    },
    testnet: true,
};

export const sepoliaNetwork: AppKitNetwork = {
    id: 11155111,
    sourceId: 1, // 修正为纯十六进制
    name: 'Sepolia',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: {
        default: { http: ['https://sepolia.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9'] },
    },
    blockExplorers: {
        default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    assets: {
        imageId: 'sepolia',
        imageUrl: 'https://picsum.photos/40/40?random=1',
    },
    testnet: true,
};

export const bscTestNetwork: AppKitNetwork = {
    id: 97,
    sourceId: 1, // 修正为纯十六进制
    name: 'BNB Smart Chain Testnet',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'tBNB',
        decimals: 18
    },
    rpcUrls: {
        default: { http: ['https://bsc-testnet.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9'] },
    },
    blockExplorers: {
        default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
    },
    assets: {
        imageId: 'bsc-testnet',
        imageUrl: 'https://picsum.photos/40/40?random=3',
    },
    testnet: true,
};

export const bscMainNetwork: AppKitNetwork = {
    id: 56,
    sourceId: 1, // 修正为纯十六进制
    name: 'Binance Smart Chain',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18
    },
    rpcUrls: {
        default: { http: ['https://bsc-mainnet.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9'] },
    },
    blockExplorers: {
        default: { name: 'BscScan', url: 'https://bscscan.com' },
    },
    assets: {
        imageId: 'bsc-net',
        imageUrl: 'https://picsum.photos/40/40?random=3',
    },
    testnet: true,
};
// 定义自定义网络，确保包含所有必需属性
// export const customNetworks: CaipNetwork[] = [
//     // 1. Sepolia 测试网
//     {
//         id: 'eip155:11155111',
//         chainNamespace: 'eip155',
//         caipNetworkId: 'eip155:11155111',
//         name: 'Sepolia',
//         nativeCurrency: {
//             name: 'Ether',
//             symbol: 'ETH',
//             decimals: 18
//         },
//         blockExplorers: {
//             default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
//         },
//         rpcUrls: {
//             default: {
//                 http: ['https://sepolia.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9']
//             },
//             backup: {
//                 http: []
//             }
//         },
//         assets: {
//             imageId: 'sepolia',
//             imageUrl: 'https://picsum.photos/40/40?random=1',
//         },
//         testnet: true,
//     },
//     // 2. 本地开发网络
//     {
//         id: 'eip155:31337',
//         chainNamespace: 'eip155',
//         caipNetworkId: 'eip155:31337',
//         name: 'Localhost',
//         nativeCurrency: {
//             name: 'Goerli Ether',
//             symbol: 'GO',
//             decimals: 18
//         },
//         blockExplorers: {
//             default: { name: 'Hardhat', url: 'http://localhost:8545' },
//         },
//         // 修正 rpcUrls 的赋值
//         rpcUrls: {
//             default: {
//                 http: ['http://127.0.0.1:8545']
//             },
//             backup: {
//                 http: []
//             }
//         },
//         assets: {
//             imageId: 'localhost',
//             imageUrl: 'https://picsum.photos/40/40?random=2',
//         },
//         testnet: true,
//     },
//     // 3. BSC Testnet（币安智能链测试网）
//     {
//         id: 'eip155:97',
//         chainNamespace: 'eip155',
//         caipNetworkId: 'eip155:97',
//         name: 'BNB Smart Chain Testnet',
//         nativeCurrency: {
//             name: 'Binance Coin',
//             symbol: 'tBNB',
//             decimals: 18
//         },
//         blockExplorers: {
//             default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
//         },
//         // 修正 rpcUrls 的赋值
//         rpcUrls: {

//             default: {
//                 http: ['https://bsc-testnet.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9']
//             },
//             backup: {
//                 http: []
//             }
//         },
//         assets: {
//             imageId: 'bsc-testnet',
//             imageUrl: 'https://picsum.photos/40/40?random=3',
//         },
//         testnet: true,
//     },
// ];



export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, polygon, base, localhostNetwork, bscTestNetwork, bscMainNetwork, sepoliaNetwork]

export const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
})
export const defaultAppkit = () => {
    return createAppKit({
        adapters: [wagmiAdapter],
        projectId: projectId,
        defaultNetwork: localhostNetwork,
        // 使用 networks 数组（必需属性）
        networks, // 合并所有网络
        themeMode: 'light',
        features: {
            analytics: true, // 可选 - 默认使用你的 Cloud 配置

            swaps: true, //开启Swap功能
            legalCheckbox: true, //开启法律复选框
        },
        // 元数据
        metadata: {
            name: 'AppKit Vue Example',
            description: 'AppKit Vue Example',
            url: "http://localhost:3001", // 使用动态 URL
            icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
        },
        themeVariables: {
            '--w3m-accent': "#000000"
        },
        connectorImages: {
            // coinbaseWallet: "https://images.mydapp.com/coinbase.png",
            'io.coinbase': "https://images.mydapp.com/coinbase.png",
            'io.metamask': "https://images.mydapp.com/metamask.png",
            // Other wallets (use normal connector IDs)
            walletConnect: "https://images.mydapp.com/walletconnect.png",
            injected: "https://images.mydapp.com/browser-wallet.png",
        },
        
        debug: true, //启用或禁用 AppKit 中的调试模式
    });
}