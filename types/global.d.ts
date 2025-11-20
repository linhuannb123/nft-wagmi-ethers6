import type { MetaMaskInpageProvider } from '@metamask/providers'
import type {
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
} from 'vue'

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider | undefined
  }

  declare type Recordable<T = any> = Record<string, T>

  declare type VueNode = VNodeChild | JSX.Element
  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  declare interface WheelEvent {
    path?: EventTarget[]
  }
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>
  declare function parseInt(s: string | number, radix?: number): number
  declare function parseFloat(string: string | number): number
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}

export interface ImportMetaEnv {
  readonly VITE_PROJECT_ID: string
  readonly VITE_APP_PINATA_KEY: string
  readonly VITE_APP_PINATA_SECRET: string
  readonly VITE_APP_PINATA_JWT: string
  readonly VITE_PRIVATEKEY_ADDRESS: string
  readonly VITE_RPC_URL: string
  readonly VITE_USE_MOCK: 'true' | 'false'
  readonly VITE_USE_COMPRESS: 'true' | 'false'
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
