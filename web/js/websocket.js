var log = function(txt) { console.log ('websocket: '+txt); }

var websocket = function(url) {
    var ws;
    if ("WebSocket" in window) {
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
        return ws;
    } else if ("MozWebSocket" in window) {
        ws = new MozWebSocket(url);
        ws.binaryType = 'arraybuffer';
        return ws;
    } else {
        console.log("Websockets not supported by this browser.");
    }
}

var ws = websocket('ws://localhost:9002');

ws.onopen = function() {
    log('open');
}
ws.onclose = function() {
    log('closed');
}
ws.onerror = function(e) {
    log('error: '+e);
}
ws.onmessage = function(msg) {
    if (typeof msg.data === 'string') {
        var el = $('#serverMessages');
        el.html(el.html()+"<br>"+msg.data);
    }
}

$('#sendMessage').click(function (e) {
    e.preventDefault();
    var message = $('#messageInput').val();
    log('sending message: '+message);
    ws.send(message);
});
