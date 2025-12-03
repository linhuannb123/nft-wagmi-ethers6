export interface AuthState {
  currentAccount: string | undefined
  status: 'disconnected' | 'connected'
  chainId: number | undefined
}
