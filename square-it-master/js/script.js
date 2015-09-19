var grid = [[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0]];

ROWS = 8;
COLUMNS = 8;
WINLEN = 5;
SIZE = 0;

pone = [];
ptwo = [];
winrecord = []
// poneX = [];
// poneY = [];
// ptwoX = [];
// ptwoY = [];

countmoves = 0;
sound = false;
lastmove = [-1, -1];
winningColor = ['', 'rgb(0, 226, 255)', 'rgb(58, 228, 0)'];
// media = new Media("/android_asset/www/background.mp3") //for android not working
media = $('#background')[0];					//for web

$(document).ready(function() {

	$('#winner').fadeOut(1);

	$('#game-screen').fadeOut(1);

 	$('#retire').click(reset); 

	$('#toggle-sound').click(function() {
		if (sound) {
			media.pause();
		} else {
			media.play();
		}
		sound = !sound;
	});

	$('#rules').click(function() {
		$('#ex').fadeIn();
	});

	$('#ex').click(function() {
		$('#ex').fadeOut();
	});


	$('#start-button').click(function() {
		SIZE = $('#grid-size-select').val();
		createDivs(SIZE);
		t = setTimeout(function() { 
				resizeDivs(SIZE) 
			}, 650);
		$('#start-screen').slideUp(700);
		// t1 = setTimeout(function() {
		$('#game-screen').fadeIn();
		// }, 1200);
	});

	$('#undo').click(function() {
		if (lastmove[0] == -1) {
			return false;
		}

		countmoves--;
		$('#' + lastmove[0] + "" + lastmove[1]).removeClass('clicked').css('background-color', '');
		grid[lastmove[0]][lastmove[1]] = 0;
		lastmove[0] = -1;

		switch (player) {
			case 1: player = 2;
				$('#footer').css('background-color', 'rgb(58, 228, 0)');
				break;
			case 2: player = 1;
				$('#footer').css('background-color', 'rgb(0, 226, 255)');
				break;
		}

	});

	player = 1;

});

function gameDivClick() {
	if ($(this).hasClass('clicked')) {
		return false;
	}
	
	$(this).addClass('clicked');
	updateGrid(parseInt(this.id), player);

	countmoves++;
	if (countmoves == ROWS * COLUMNS) {
		declareDraw();
	}
	
	if (player == 1) {
		$(this).css('background-color', 'rgb(0, 226, 255)');
		// $('.game-div').css('border-color', 'rgb(58, 228, 0)');
		$('#footer').css('background-color', 'rgb(58, 228, 0)');
		player = 2;
		checkStatus(1);
	} else {
		$(this).css('background-color', 'rgb(58, 228, 0)');
		// $('.game-div').css('border-color', 'rgb(0, 226, 255)');
		$('#footer').css('background-color', 'rgb(0, 226, 255)');
		player = 1;
		checkStatus(2);
	}
}

function createDivs(n) {
	cls = "game-div-" + n;
	n = parseInt(n);
	for (i = 0; i < n; i++) {
		for (j = 0; j < n; j++) {
			d = $("<div></div>");
			d.addClass("game-div")
			d.addClass(cls);
			d.bind("click", gameDivClick);
			d.attr('id', (i + "" + j));
			$("#game-divs-container").append(d);
		}
	}
}

function resizeDivs(n) {
	n = n.trim();
	w = $(".game-div-" + n).width();
	//console.log(w); 
	$(".game-div-" + n).each(function() { 		
  		$(this).css("height", w);
	});
}

function updateGrid(s, plr) {
	var x = parseInt(s / 10); 
	var y = s % 10;
	// console.log(s + " " + x + " " + y);
	grid[x][y] = plr;
	lastmove[0] = x;
	lastmove[1] = y;
	
	switch (plr) {
		case 1:
			pone.push({'x':x, 'y':y});
			//poneX.push(x);
			//poneY.push(y);
			// console.log(poneX); console.log(poneY);
			break;
		case 2: 
			ptwo.push({'x':x, 'y':y});
			//ptwoX.push(x);
			//ptwoY.push(y);
			break;
	}
}

function declareDraw() {
	$('#winner-details').html("<p style='color:black;'>Game Draw!</p>");
	$('#winner').fadeIn("fast");
	$('#winner-details').css('background-color', "white");
	$('#winner').click(function() {
		$(this).fadeOut(1);
		reset();
	});
}

function checkStatus(plr) {
	if (pone.length < 4) {
		return 0;
	}
	if (square(plr)) {
		declareWinner(plr);
	}
	return 0;
}

function dist(p, q) {
    return (p.x - q.x)*(p.x - q.x) +
           (p.y - q.y)*(p.y - q.y);
}

function isSquare(p1, p2, p3, p4) {
	var d2 = dist(p1, p2);  
    var d3 = dist(p1, p3);  
    var d4 = dist(p1, p4);
    console.log(d2, d3, d4); 

    if (d2 == d3 && 2 * d2 == d4)
    {
        var d = dist(p2, p4);
        return (d == dist(p3, p4) && d == d2);
    }
 
    // The below two cases are similar to above case
    if (d3 == d4 && 2 * d3 == d2)
    {
        var d = dist(p2, p3);
        return (d == dist(p2, p4) && d == d3);
    }

    if (d2 == d4 && 2 * d2 == d3)
    {
        var d = dist(p2, p3);
        return (d == dist(p3, p4) && d == d2);
    }
 
    return false;
}

//WINNING LOGIC
function square(plr) {
	if (plr == 1) {
		var arr = pone;
	} else if (plr == 2) {
		var arr = ptwo;
	}
	var n = arr.length;
	for (i = 0; i < n - 3; i++) {
		var a = arr[i];
		for (j = i + 1; j < n - 2; j++) {
			var b = arr[j];
			for (k = j + 1; k < n - 1; k++) {
				var c = arr[k];
				for (l = k + 1; l < n; l++) {
					var d = arr[l];
					if (isSquare(a, b, c, d)) {
						winrecord.push(a); winrecord.push(b);
						winrecord.push(c); winrecord.push(d);
						return 1;
					}
				}
			}
		}
	}
	if (i == n - 3 && j == n - 2 && k == n - 1 && l == n) {
		return 0;
	}
}


function declareWinner(plr) {
	for (var i = 0; i < 4; i++) {
		$('#' + winrecord[i].x + '' + winrecord[i].y).css("background-color", "yellow");
	}


	$('#winner-details').html("Player " + plr + " wins.<br>TAP anywhere to continue.");
	$('#winner').fadeIn("fast");
	$('#winner-details').css('background-color', winningColor[plr]);
	$('#winner-details').css('opacity', 0.8);
	$('#winner').click(function() {
		$(this).fadeOut(1);
		reset();
	});
}

function reset() {
	player = 1;
	for (i = 0; i < SIZE; i++) {
		for (j = 0; j < SIZE; j++) {
			grid[i][j] = 0;
		}
	}

	lastmove[0] = -1;
	countmoves = 0;
	// poneX = [];		poneY = [];		ptwoX = [];		ptwoY = [];
	pone = [];		ptwo = [];		winrecord = [];

	$('#start-screen').slideDown();
	$('#game-screen').fadeOut();
	$('#footer').css('background-color', 'rgb(0, 226, 255)');
	$("#game-divs-container").empty(d);

	$('.game-div').each(function() {
		$(this).css('background-color', '').removeClass('clicked');
	});
}