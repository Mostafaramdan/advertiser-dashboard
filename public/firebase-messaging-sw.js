/** this file for dev mode if you update anything here please update firebaseSw.js file also for production */

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyAGL1_NvcWenrVzVLPlz_v4-aVuorgbdGg',
  authDomain: 'be-trend-362910.firebaseapp.com',
  projectId: 'be-trend-362910',
  storageBucket: 'be-trend-362910.appspot.com',
  messagingSenderId: '289507681569',
  appId: '1:289507681569:web:5ac3b25f06610449494a60',
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
