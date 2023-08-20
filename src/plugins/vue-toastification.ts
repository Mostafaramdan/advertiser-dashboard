import Toast from 'vue-toastification'

export default (app: any) => {
  app.use(Toast, {
    position: 'bottom-center',
    timeout: 2500,
    closeOnClick: false,
  })
}
