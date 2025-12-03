import { defineStore } from 'pinia'
import { UseModalState } from './types'
import piniaStore from '@/store'
export const useModalStore = defineStore('useModal', {
  state: (): UseModalState => {
    return {
      isOpen: false,
      isConnected: false,
    }
  },
  actions: {
    openModal() {
      this.isOpen = true
    },
    closeModal() {
      this.isOpen = false
    },
    openUserLogin() {
      this.isConnected = true
    },
    closeUserLogin() {
      this.isConnected = false
    },
  },
})

/**
 * 导出一个使用模态框store的函数
 * 这个函数返回一个使用piniaStore的useModalStore实例
 * @returns {Function} 返回useModalStore函数，该函数接收piniaStore作为参数
 */
export function useModalStoreWithOut() {
  return useModalStore(piniaStore)
}
