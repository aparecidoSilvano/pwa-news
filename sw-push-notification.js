(function () {
    'use strict';

    var swPush;
    const applicationServerPublicKey = 'BC4KqvEK8QhWRgry5ZPGvCqH7aZT6BuffpDQEQYantfzP8SdIps9miJPhCjuquWMqLCZ3gfFjD8VAgF6yqksjI4';

    if ('serviceWorker' in navigator && 'PushManager' in window) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw-news-push.js').then(function (swRegister) {

                swPush = swRegister;
                console.log('Notification service worker is registered', swRegister);

                getSusbscription();

            }).catch(function (error) {
                console.log("Notification service worker error", error);
            });
        });
    } else {
        console.warn('Push messaging is not supported');
    }

    function getSusbscription() {
        if (swPush) {
            swPush.pushManager.getSubscription().then(function (subscription) {
                if (subscription) {

                    console.log('User is subscribed');
                } else {

                    console.log("User isn't subscribed");
                    registerUser();
                }
            });
        }
    }

    function registerUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swPush.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey}
        ).then(function (subscription) {

            console.log('User is subscribed:');
            console.log('Use this json on web-push-codelab.glitch.me to verify the notifications', JSON.stringify(subscription));

        }).catch(function (error) {

            console.log('Failed to subscribe the user: ', error);
        });
    }

    self.addEventListener('push', function (event) {

        console.log('[Service Worker] Push Received.');
        console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

        const title = 'PWA News';
        var options = {
            body: 'Venha conferir as novidades',
            icon: 'images/favicon.ico',
            badge: 'images/favicon.ico'
        };

        const notificationPromise = self.registration.showNotification(title, options);
        event.waitUntil(notificationPromise);
    });

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();

        event.waitUntil(clients.openWindow('https://news.google.com.br'));
    });

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        
        return outputArray;
    }
})();