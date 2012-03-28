
var context;
var windGainNode;
var windBuffer = null;
var thunderBuffer = null;

//window.addEventListener('load', initWindSound, false);

function initWindSound() {
    try {
        context = new webkitAudioContext();
        console.log('loading wind sound');
        loadWindSound('/wind.wav');
        loadThunderSound('/shortthunder.wav');
    } catch (e) {
        alert('Web Audio API is not supported in this browser');
    }
}

function playSound(buffer, loop) {
    console.log('playing sound');
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.loop = loop;
    //source.connect(context.destination);       // connect the source to the context's destination (the speakers)

    windGainNode = context.createGainNode();
    source.connect(windGainNode);
    windGainNode.connect(context.destination);
    windGainNode.gain.value = 0.5;
    console.log('note on');
    source.noteOn(0);                          // play the source now
}

/*
$(document).keydown(function(e) {
	console.log(e);
	if (e.keyCode == 37) { 
	    // left
	} else if (e.keyCode == 39) {
	    // right
	} else if (e.keyCode == 38) {
	    // up
        windGainNode.gain.value += 0.1;
        console.log('windGainNode value', windGainNode.gain.value);
	} else if (e.keyCode == 40) {
	    // down
        windGainNode.gain.value -= 0.1;
        console.log('windGainNode value', windGainNode.gain.value);
    } 
    });
*/

function loadWindSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response,
                                function(buffer) {
                                    console.log('decoded wind sound buffer');
                                    if (!buffer) {
                                        alert('error decoding file data: ' + url);
                                        return;
                                    }
                                    windBuffer = buffer;
                                    playSound(buffer, true);
                                });
    };
    request.send();
}

function loadThunderSound(url) {
    console.log('loading thunder sound');
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response,
                                function(buffer) {
                                    console.log('decoded thunder sound buffer');
                                    if (!buffer) {
                                        alert('error decoding thunder sound: ' + url);
                                        return;
                                    }
                                    thunderBuffer = buffer;
                                });
    };
    request.send();
}
