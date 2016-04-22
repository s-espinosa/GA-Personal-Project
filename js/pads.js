function padsSetUp() {


	console.log("getting into padsSetUp")

	// someday/maybe refactor so that each sound is it's own object with on/off colors, patterns... anything else?


	//**INITIAL SETUP**//

	// load audio
	var kickSound = new Audio("audio/kick.wav");
	var snareSound = new Audio("audio/snare.wav");
	var hatClosedSound = new Audio("audio/hatClosed.wav");
	var hatOpenSound = new Audio("audio/hatOpen.wav");

	// setup
	var onOff = "off";
	var toClearOnOff = 0;
	var currentBeat = 0; //Out of number of pads
	var previousBeat = 31; //Hard coded for 32 pads
	var padsArray = $(".pads");
	console.log(padsArray);
	var soundsArray = $(".sounds");
	console.log(soundsArray);

	// pad colors
	this.kickOn = "purple";
	this.kickOnBlink = "#E1AADD";
	this.snareOn = "orange";
	this.snareOnBlink = "#FFC58B";
	this.hatClosedOn = "teal";
	this.hatClosedOnBlink = "#8FEEEE";
	this.hatOpenOn = "navy";
	this.hatOpenOnBlink = "#B9C0F2";

	var padBackOn = kickOn;
	var padBackOnBlink = kickOnBlink;
	var padBackOff = "#A4A6A5";
	var padBackOffBlink = "#CFD2D1";

	// old nice blue blink
	// var padBackOn = "#67A7CE";
	// var padBackOnBlink = "#7FC8F6";


	// instrument pattern arrays
	this.kickPattern = [];
	this.snarePattern = [];
	this.hatClosedPattern = [];
	this.hatOpenPattern = [];

	// Set kick as initial sound
	this.activeSound = "kick";
	this.activeSoundPattern = kickPattern;

	// initial beat per minute values
	var bpm = 100; //100 beats per minute hard coded for now
	var mspbeat = (60*1000)/bpm; //calculate milliseconds for each beat
	var msp16th = mspbeat/4; //calculate milliseconds for each sixteenth note

	var parent = this;

	// create bpm slider
	$( "#bpmSlider" ).slider({
		value: 50,
		range: "min",
		change: function( event, ui ) {
			changeBPM()
		}
	});

	// add attributes and onclick behavior to pads
	setPads();
	setSounds();




	// Set "on" button functions
	// if it's clicked and alreaday on, do nothing
	// if it's clicked and off, set onOff to "on", blink the first pad, then repeat for next pad every sixteenth note 
	document.getElementById("start").onclick = function() {
		if(onOff === "on") {
			return;
		} else {
			onOff = "on";
			blinkOn();
			// toClearOnOff = setInterval(function(){blinkOn();}, msp16th*padsArray.length);
			toClearOnOff = setInterval(function(){blinkOn();}, msp16th);		
		}
	}

	// Set the "off" button up.
	// if it's clicked and everything is already off (onOff set to "off"), do nothing.
	// if it's clicked and everything is on, turn it off using the clearInterval function generated by the on button.
	document.getElementById("stop").onclick = function() {
		if(onOff === "off") {
			return;
		} else {
			onOff = "off";
			currentBeat = 0;
			changePads(activeSound);
			clearInterval(toClearOnOff);
		}
	}




	// blinking function for pads
	// calls each of the functions that should occur when a pad blinks on
	// increments the current beat (16th) after each time called
	function blinkOn() {
		if (onOff === "off") {
			return;
		} else {
			howToBlink(padsArray[currentBeat],currentBeat);
			howToPlay(currentBeat, kickPattern, "kick");
			howToPlay(currentBeat, snarePattern, "snare");
			howToPlay(currentBeat, hatClosedPattern, "hatClosed");
			howToPlay(currentBeat, hatOpenPattern, "hatOpen");

			if (currentBeat === padsArray.length-1){
				currentBeat = 0;
			} else  {
				currentBeat++;
			}
		}
	}


	// set delays for blinking behavior on each pad
	// blink the current pad
	// turn off the previous pad as you blink the new one
	function howToBlink(padElement, count) {
		if (currentBeat === 0) {
			previousBeat = 31;
		} else {
			previousBeat = currentBeat-1;
		}

		if (activeSoundPattern[currentBeat] === 0) {
			padsArray[currentBeat].style.backgroundColor = padBackOffBlink;
		} else {
			padsArray[currentBeat].style.backgroundColor = padBackOnBlink;
		}
		
		if (activeSoundPattern[previousBeat] === 0) {
			padsArray[previousBeat].style.backgroundColor = padBackOff;
		} else {
			padsArray[previousBeat].style.backgroundColor = padBackOn;
		}
	}






	// This is where the actual playing of the sound happens.
	// Pull the sound name, create a path to the sound,
	// access the array for the sound and determine if it's on or off (1 or 0)
	// play the sound if it's on, get out of the function if it's off
	function howToPlay(count, drumArray, drumSound) {
		var soundPath = "audio/" + drumSound + ".wav"

		if (drumArray[count] === 1) {
			this.snd = new Audio(soundPath);
			snd.play();
		} else {
			return;
		}
	}





	// Assign numbers to each of the pads using an attribute.
	// Generate an array that's equal to the number of pads for each drum sound.
	// Make the pads turn on and off when clicked by assigning an onclick function to each pad.
	function setPads() {
		for (i=0; i < padsArray.length; i++) {
			padsArray[i].setAttribute("padNumber", i);
			kickPattern.push(0);
			snarePattern.push(0);
			hatClosedPattern.push(0);
			hatOpenPattern.push(0);
			padsArray[i].onclick = function() {
				var padNumber = this.getAttribute("padNumber");
				if (activeSoundPattern[padNumber] === 0) {
					activeSoundPattern[padNumber] = 1;
					this.style.backgroundColor = padBackOn;
				} else {
					activeSoundPattern[padNumber] = 0;
					this.style.backgroundColor = padBackOff;		
				}
			}	
		}
	}



	// set up each of the sound pads
	// each pad onclick function gets the name of the sound associated with the pad and plays it
	// if it's not the sound that's currently showing on the pads it also calls changePads
	function setSounds() {
		for (i=0; i < soundsArray.length; i++) {
			soundsArray[i].onclick = function() {
				var soundName = this.id;

				if (activeSound === soundName) {
					var soundPath = "audio/" + soundName + ".wav"
					var snd = new Audio(soundPath);
					snd.play();
				} else {
					changePads (soundName);
					var soundPath = "audio/" + soundName + ".wav"
					var snd = new Audio(soundPath);
					snd.play();
				}
			}	
		}
	}

//There's an issue here with accessing padsSetUp variables. When it wasn't a function you could access these 
//variables as part of the window[] object. Now I can't get at them using the named variable that I've
//constructed.


	// creates variables to access window[] attributes so that it can 
	// set global variables to the values associated with the sound pad that called this function
	// (which sound is on, which pattern is on, what colors are associated with that sound)
	// clears all the pads from the previous sound and sets them up using the new colors and active sound pattern
	function changePads(newPad) {
		var newPadOn = newPad + "On";
		var newPadOnBlink = newPadOn + "Blink";
		var patternToActivate = newPad + "Pattern";


		activeSound = newPad;
		console.log(patternToActivate);
		activeSoundPattern = parent[patternToActivate];
		console.log(activeSoundPattern);
		padBackOn = parent[newPadOn];
		padBackOnBlink = parent[newPadOnBlink];
		console.log(padBackOnBlink);


		for (i=0; i<padsArray.length; i++) {
			if (activeSoundPattern[i] === 0) {
				padsArray[i].style.backgroundColor = padBackOff;
			} else {
				padsArray[i].style.backgroundColor = padBackOn;
			}

		}
	}


	// get BPM from bpmSlider and update global bpm
	function changeBPM() {
		var bpmSliderValue = $("#bpmSlider").slider("value");
		console.log(bpmSliderValue);
		bpm = 50 + bpmSliderValue;
		console.log (bpm);
		mspbeat = (60*1000)/bpm; //calculate milliseconds for each beat
		msp16th = mspbeat/4; //calculate milliseconds for each sixteenth note

		if (onOff === "on") {
			clearInterval(toClearOnOff);
			toClearOnOff = setInterval(function(){blinkOn();}, msp16th);
		} else {
			return;
		}
	}
}