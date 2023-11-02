// Import the functions you need from the SDKs you need
import { useAuthStore } from '@/stores/AuthStore'
import { useNotificationsStore } from '@/stores/Notifications'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'

async function init() {
  const authStore = useAuthStore()
  const notificationStore = useNotificationsStore()

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_AIP_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const messaging = getMessaging()

  onMessage(messaging, (payload) => {
    const notification: any = payload.data
    notification.action_by = JSON.parse(notification.action_by)
    notification.is_seen = JSON.parse(notification.is_seen)
    notification.model_id = +notification.model_id
    // console.log('notification', notification as DashboardNotification)

    notificationStore.receiveNotification(notification)
  })

  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.

  // if there is a token and the user reset or change notifications permission
  if (authStore.fcmToken && Notification.permission !== 'granted') {
    authStore.deleteFcmToken()
  }

  // Request Permission of Notifications
  Notification.requestPermission()
    .then((permission) => {
      console.log('permission', permission)
      if (permission === 'granted') {
        if (!authStore.fcmToken) {
          console.log('Notification permission granted! and getting token')

          // Get Token
          getToken(messaging, {
            vapidKey: import.meta.env.VITE_FB_VAPID_KEY,
          })
            .then((currentToken) => {
              if (currentToken) {
                // Send the token to your server and update the UI if necessary
                // sendTokenToServer()
                console.log('currentToken', currentToken)
                authStore.setFcmToken(currentToken)
                console.log('send token to server', currentToken)
              } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.')

                // ...
              }
            })
            .catch((err) => {
              console.log('An error occurred while retrieving token. ', err)

              window.location.reload()

              // ...
            })
        }
      } else {
        authStore.deleteFcmToken()
      }
    })
    .catch((err) => {
      console.log('Unable to get permission to notify.', err)
    })
}

export async function initFirebase() {
  const isSupportedBrowser = await isSupported()
  if (isSupportedBrowser && 'serviceWorker' in navigator) {
    init()
  }
}
