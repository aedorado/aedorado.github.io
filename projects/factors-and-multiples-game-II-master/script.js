window.onload = restart;

first = true;
last = true;
player = 1;
count = 50;

turnDiv = document.getElementById('turn');
movesDiv = document.getElementById('moves');
infoDiv = document.getElementById('info');

function initialise() {
	var article = document.getElementsByTagName('article')[0];
	article.innerHTML = null;
	document.getElementsByTagName('body')[0].height = window.innerHeight;
	for (var i = 1; i <= 50; i++) {
		var createdDiv = document.createElement('div');
		createdDiv.setAttribute('id', i);
		createdDiv.setAttribute('class', 'clickable');
		createdDiv.addEventListener('click', numberClicked, false);
		createdDiv.innerHTML = i;
		article.appendChild(createdDiv);
	}
}

function notFactOrMul() {
	document.getElementById('notFact').style.opacity = 1;
	setTimeout(hideFactOrMul, 2000);
}

function hideFactOrMul(id) {
	document.getElementById("notFact").style.opacity = 0;
}

function numberClicked() {
	if (this.id == 1) {
		return;;
	}
	count--;
	infoDiv.style.opacity = 1;
	this.style.opacity = 0.5;
	this.removeEventListener('click', numberClicked, false);
	this.setAttribute('class', 'unclickable');

	for (i = 1; i <= 50; i++) {
		if (((this.id % i) == 0) || ((i % this.id) == 0)) {
			elem = document.getElementById(i);
			if (elem.className != 'unclickable') {
				count--;
			}
			elem.style.opacity = 0.5;
			elem.removeEventListener('click', numberClicked, false);
			elem.setAttribute('class', 'unclickable');
		}
	}

	if (count == 0) {
		turnDiv.innerHTML = "Player " + player + " wins.";
		return 0;
	}

	if (player == 1) {
		player = 2;
	} else {
		player = 1;
	}
	turnDiv.innerHTML = "TURN : Player " + player + "<br />";
}



function restart() {
	first = true;
	last = null;
	player = 1; // player 1;
	count = 50;
	infoDiv.style.opacity = 0;
	initialise();
}