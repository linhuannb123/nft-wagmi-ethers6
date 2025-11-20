import vue from '@vitejs/plugin-vue'

export const ConfigVuePlugin = () => {
  return vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag: any) =>
          ['appkit-button', 'appkit-network-button'].includes(tag),
      },
    },
  })
}
