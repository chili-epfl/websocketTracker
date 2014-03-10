$(document).keydown(function(e){
    if (e.keyCode == '68') {  // 'd' for 'debug'
       $("#debugPanel").toggle();
       return false;
    } else if (e.keyCode == '67') { // 'c' for 'calibration'
       $("#calibrate").click();
    }
});
