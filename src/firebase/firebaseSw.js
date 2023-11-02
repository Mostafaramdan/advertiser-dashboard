/** this file for production mode if you update anything here please update firebase-messaging-sw.js file also for dev mode */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

console.log('#################################### registered firebaseSw.js')

// Initialize the Firebase app in the service worker by passing in
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: import.meta.env.VITE_FB_AIP_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  console.log('Notification', payload)

  // Customize notification here
  const notificationTitle = payload.data.title

  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    image: payload.data.image,
    tag: payload.data.url,
    data: {
      url: payload.data.url,
    },
  }

  self.registration.showNotification(notificationTitle, notificationOptions)

  // Add click event handling within the callback
  self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    let targetUrl = event.notification.data.url
    if (targetUrl) {
      console.log('notification url', targetUrl)
      event.waitUntil(clients.openWindow(targetUrl))
    }
  })
})
