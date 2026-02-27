// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCBWrU8jvaMjrachP9amOX1zJ-KavEPTjo",
  authDomain: "gardeniatodaynew.firebaseapp.com",
  projectId: "gardeniatodaynew",
  storageBucket: "gardeniatodaynew.firebasestorage.app",
  messagingSenderId: "805080687276",
  appId: "1:805080687276:web:8cfa2db1884f916b1ff509",
  measurementId: "G-6V2JS7ZN1F"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'جاردينيا توداي';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك إشعار جديد',
    icon: '/gardeniatoday/icons/Icon-192.png', // المسار الصحيح مع اسم المشروع
    badge: '/gardeniatoday/icons/Icon-192.png',
    image: payload.notification?.image,
    data: payload.data || {},
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  // المسار الصحيح للتطبيق على GitHub Pages
  const urlToOpen = 'https://mzmy200.github.io/gardeniatoday/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes('gardeniatoday') && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle push event directly (fallback)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  try {
    const data = event.data?.json();
    const title = data?.notification?.title || 'جاردينيا توداي';
    const options = {
      body: data?.notification?.body || 'لديك إشعار جديد',
      icon: '/gardeniatoday/icons/Icon-192.png',
      badge: '/gardeniatoday/icons/Icon-192.png',
      data: {
        url: 'https://mzmy200.github.io/gardeniatoday/',
        ...data?.data
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// Service Worker lifecycle events
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});