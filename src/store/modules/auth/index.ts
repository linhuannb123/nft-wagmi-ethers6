import { defineStore } from 'pinia'
import { AuthState } from './types'
import piniaStore from '@/store/index'
//  undefined undefined connecting

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    return {
      currentAccount: undefined,
      status: 'disconnected',
      chainId: undefined,
    }
  },
  actions: {
    setAuth(value: string) {
      this.currentAccount = value
    },
    setStatus(value: 'disconnected' | 'connected') {
      this.status = value
    },
    setChain(value: number | undefined) {
      this.chainId = value
    },
    initAuth() {
      this.currentAccount = undefined
    },
    initStatus() {
      this.status = 'disconnected'
    },
    initChain() {
      this.chainId = undefined
    },
  },
  persist: {
    storage: localStorage, // 存储方式
    pick: ['currentAccount', 'status', 'chainId'], // 要持久化的字段
  },
})

export function useAuthOutStore() {
  return useAuthStore(piniaStore)
}
