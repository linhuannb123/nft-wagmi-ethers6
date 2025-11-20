import { defineStore } from 'pinia'
//  undefined undefined connecting
interface AuthState {
  currentAccount: string | undefined
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  chainId: number | undefined
}
const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    return {
      currentAccount: undefined,
      status: 'connecting',
      chainId: undefined,
    }
  },
  actions: {
    setAuth(value: string) {
      this.currentAccount = value
    },
    setStatus(value: 'disconnected' | 'connecting' | 'connected' | 'reconnecting') {
      this.status = value
    },
    setChain(value: number | undefined) {
      this.chainId = value;
    },
    initAuth() {
      this.currentAccount = undefined;
    },
    initStatus() {
      this.status = 'connecting';
    },
    initChain() {
      this.chainId = undefined;
    },
  },
})

export default useAuthStore
