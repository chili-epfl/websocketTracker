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
    console.log("open");
    $("#calibrate").click();
}
ws.onclose = function() {console.log("close");}
ws.onerror = function(e) {console.log('error: '+e);}
ws.onmessage = function(msg) {
    if (typeof msg.data === 'string') {
        var el = $('#received');
        el.html(msg.data);
        var o = jQuery.parseJSON(msg.data);    
        if (o.type == "calibration") {
            myRenderer.updateCalib(o.projection, o.modelview)
            myRenderer.updateCamera(o.camera)
            $("#calibration").html(msg.data);
        } else if (o.type == "tagUpdate") {
            initTagInfo();
            for (var i=0;i<o.tags.length;i++) {
                var tagId = o.tags[0].id;
                var xPos = o.tags[0].corners[0];
                var yPos = o.tags[0].corners[1];            
                var rot = 0;
                myRenderer.updateTag(tagId, xPos, yPos, rot);                
            }
        }
    }
    myRenderer.renderer.render(myRenderer.scene, myRenderer.camera);
}


$('#calibrate').click(function (e) {
    e.preventDefault();
    ws.send("calibrate");
});

function initTagInfo() {
    $('#tags').html("")
}

$('#sendMessage').click(function (e) {
    e.preventDefault();
    var message = $('#messageInput').val();
    var el = $('#sent'); 
    if (el.html() != "") {el.html(el.html()+"<br>");}
    el.html(el.html()+message);
    ws.send(message);
});


