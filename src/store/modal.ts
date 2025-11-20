import { defineStore } from 'pinia';
export interface UseModalState {
    isOpen: boolean;
    isConnected:boolean;
}
 const useModalStore = defineStore('useModal', {
    state: (): UseModalState => {
        return {
            isOpen: false,
            isConnected:false,
        }
    },
    actions: {
        openModal() {
            this.isOpen = true;
        },
        closeModal() {
            this.isOpen = false;
        },
        openUserLogin() {
            this.isConnected = true;
        },
        closeUserLogin() {
            this.isConnected = false;

        }
    },
});

export default useModalStore;