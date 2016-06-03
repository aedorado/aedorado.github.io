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

	$('#start-button').click(function() {
		$('#start-screen').slideUp();
		$('#game-screen').fadeIn();
	});


	player = 1;
	$('.game-div').mousedown(function() {

		$('#undo').click(function() {
			if (lastmove[0] == -1) {
				return false;
			}

			countmoves--;
			$('#game-div-' + lastmove[0] + "" + lastmove[1]).removeClass('clicked').css('background-color', '');
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


		if ($(this).hasClass('clicked')) {
			return false;
		}
		
		updateGrid(this.id, player);
		countmoves++;
		if (countmoves == ROWS * COLUMNS) {
			declareDraw();
		}
		
		$(this).addClass('clicked');
		
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
	});

});

function updateGrid(s, p) {
	var x = s.substr(9, 1); 
	var y = s.substr(10, 1);
	// console.log(x + " " + y);
	grid[x][y] = p;
	lastmove[0] = x;
	lastmove[1] = y;
	// logg();
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

function checkStatus(p) {
	if (checkHorizontal(p) || checkVertical(p) || checkDiagonal2R(p) || checkDiagonal2L(p)) {
		declareWinner(p);
	} 
}

function declareWinner(p) {
	$('#winner-details').html("Player " + p + " wins.<br>TAP anywhere to continue.");
	$('#winner').fadeIn("fast");
	$('#winner-details').css('background-color', winningColor[p]);
	$('#winner').click(function() {
		$(this).fadeOut(1);
		reset();
	});
}

function checkHorizontal(p) {
	for (i = 0; i < ROWS; i++) {
		for (k = 0; k < COLUMNS - WINLEN + 1; k++) {
			c = 0;
			for (j = k; j < k + WINLEN; j++) {
				if (grid[i][j] == p) {
					c++;
				} else {
					break;
				}
			}
			if (c == WINLEN) {
				return true;
			}
		}
	}
	return false;
}

function checkVertical(p) {
	for (i = 0; i < ROWS; i++) {
		for (k = 0; k < COLUMNS - WINLEN + 1; k++) {
			c = 0;
			for (j = k; j < k + WINLEN; j++) {
					if (grid[j][i] == p) {
					c++;
				} else {
					break;
				}
			}
			if (c == WINLEN) {
				return true;
			}
		}
	}
	return false;
}

function checkDiagonal2R(p) {

	t = 1;
	for (k = WINLEN - ROWS; k <= ROWS - WINLEN; k++) {	//difference in row index and col index is fixed for a particular diagonal
		ladder = 0;
		for (l = 0; l < t; l++) {
			j = Math.max(k, 0) + ladder; i = j - k;
			for (m = 0; m < WINLEN; m++) {
				if (grid[i + m][j + m] != p) {
					break;
				}
			}

			if (m == WINLEN) {
				return true;
			}

			ladder++;
		}
		if (k >= 0) {
			t--;
		} else {
			t++;
		}
	}

	return false;
}


function checkDiagonal2L(p) {
	t = 1;
	for (k = WINLEN - 1; k < ROWS * 2 - 1 - WINLEN + 1; k++) {
        ladder = 0;
		for (l = 0; l < t; l++) {
			j = Math.min(k, 7) - ladder; i = k - j;
			for (m = 0; m < WINLEN; m++) {
				if (grid[i + m][j - m] != p) {
					break;
				}
			}

			if (m == WINLEN) {
				return true;
			}

			ladder++;
		}
		if (k < ROWS - 1) {
			t++;
		} else {
			t--;
		}
    }

    return false;
}

function reset() {
	player = 1;
	for (i = 0; i < ROWS; i++) {
		for (j = 0; j < COLUMNS; j++) {
			grid[i][j] = 0;
		}
	}

	lastmove[0] = -1;
	countmoves = 0;

	$('#start-screen').slideDown();
	$('#game-screen').fadeOut();
	$('#footer').css('background-color', 'rgb(0, 226, 255)');

	$('.game-div').each(function() {
		$(this).css('background-color', '').removeClass('clicked');
	});
}