// JavaScript Document
self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.task) {
        case 'begin':
            self.postMessage('WORKER STARTED: ' + data.message);
            break;
        default:
            self.postMessage('Unknown command: ' + data.message);
    };
}, false);
