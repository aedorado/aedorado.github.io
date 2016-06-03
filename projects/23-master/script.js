var WINNUM =  23;
var WAIT = false;
var STARTED = false;

var displayNum = 0
var Edisplay = document.getElementById("display-content");
var player = 1;

window.onresize = window.onload = function() {
	for (var i = 1; i <= 4; i++) {
		var element = document.querySelector('#click-div-' + i);
		element.style.height = element.scrollWidth;
	}
	var element = document.querySelector('#title');
	element.style.height = element.scrollWidth;
}

document.querySelector('#start-div').onclick = function() {
	document.querySelector('#game-div').onclick = function() {};
	this.className = 'invisible';
	this.style.zIndex = -1;
	document.querySelector('#game-div').className = '';
	setTimeout(function(){
		document.querySelector('#p2').className += ' invisible';
	}, 1000);
	STARTED = true;
}

window.onkeypress = function(e) {
	if (STARTED) {
			if ((e.keyCode >= 48 && e.keyCode <= 52) || (e.keyCode >= 96 && e.keyCode <= 99)) {
				addDisplay(e.charCode - 48);
				var rotatedAlready = document.querySelector("#click-div-" + (e.charCode - 48)).style.transform.substring(7, 11);
				rotatedAlready = (rotatedAlready === "") ? 0 : rotatedAlready;
				console.log(rotatedAlready);
				if (rotatedAlready != 0) {
					console.log(rotatedAlready);
					rotatedAlready = (rotatedAlready.charAt(3) == 'd') ? rotatedAlready.substring(0, 3) : rotatedAlready;
					console.log(rotatedAlready);
				}
				//console.log(parseInt(rotatedAlready) + 360);
				document.querySelector("#click-div-" + (e.charCode - 48)).style.transform = 'rotate(' + (parseInt(rotatedAlready) + 360) + 'deg)';
			}
	}
}

function addDisplay(d) {
	
	function visual() {
		Edisplay.className = 'invisible';
		displayNum += d;
		setTimeout(function() {
			Edisplay.innerHTML = displayNum;
			Edisplay.className = '';
		}, 300);

		if (displayNum != WINNUM) {		
			player = 3 - player; 	// player := 3 - 1 = 2 OR 3 - 2 = 1
			switch (player) {
				case 2:
					document.querySelector('#p2').className = 'pimg';
					document.querySelector('#p1').className += ' invisible';
					break;
				case 1:
					document.querySelector('#p1').className = 'pimg';
					document.querySelector('#p2').className += ' invisible';
					break;
			}
		} else {
			document.querySelector('#win-' + player).className = "win ";
			Edisplay.innerHTML = WINNUM;
			reset();
			return ;
		}
	}

	if (STARTED) {
		if (d + displayNum > WINNUM) {
			alert('Wrong Move.')
			return ;
		}
		visual();
	}
}

function reset() {
	function visual() {
		document.querySelector('#p1').className = 'pimg';
		document.querySelector('#p2').className = 'pimg';
		var clickDiv = document.getElementsByClassName('click-div');
		for (var i = 0; i < clickDiv.length; i++) {
			clickDiv[i].style.transform = '';
		}

	}
	STARTED = false;
	player = 1;
	displayNum = 0;
	Edisplay.innerHTML = 0;
	visual();
	document.querySelector('#game-div').onclick = function() {
		this.className = 'invisible';
		document.querySelector('#win-1').className = 'win invisible';
		document.querySelector('#win-2').className = 'win invisible';
		document.querySelector('#start-div').style.zIndex = 10;
		document.querySelector('#start-div').className = '';
	}
}
