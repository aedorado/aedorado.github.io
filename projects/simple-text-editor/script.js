var notepad = document.getElementById('notepad');
var isfocus = false;	// tells is there is focus on any of the paragraphs or not
var focusOn;

var placeholder = document.getElementsByClassName('placeholder')[0];

placeholder.addEventListener('focus', pfocus, false);
placeholder.addEventListener('blur', pblur, false);
placeholder.addEventListener('dblclick', showTooltip, false);
placeholder.addEventListener('dragstart', handleDragStart, false);
placeholder.addEventListener('dragenter', handleDragEnter, false);
placeholder.addEventListener('dragover', handleDragOver, false);
placeholder.addEventListener('dragleave', handleDragLeave, false);
placeholder.addEventListener('drop', handleDrop, false);
placeholder.addEventListener('dragend', handleDragEnd, false);

function pfocus() {
	isfocus = true;
	focusOn = this;	// save the element with focus
}

function pblur() {
	isfocus = false;
	focusOn = undefined;
}

placeholder.addEventListener('click', removePlaceholder, false);
function removePlaceholder(e) {
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}
	this.classList.remove('placeholder');
	this.removeEventListener('click', removePlaceholder);
}

// // DRAG EVENT HANDLERS
var dragSrc = null;
function handleDragStart(e) {
	this.style.opacity = 0.4;
	dragSrc = this;
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	e.dataTransfer.dropEffect = 'move';  // Sse the section on the DataTransfer object.
	return false;
}

function handleDragEnter(e) {	// this/e.target is current target element.
	this.classList.add('over');
}

function handleDragLeave(e) {	// this/e.target is current target element.
	this.classList.remove('over');
}

function handleDrop(e) {	// this/e.target is current target element.
	if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	}

	if (dragSrc != this) {	// don't do anything if dropping the same column we're dragging.
		// set the source column's HTML to the HTML of the column we dropped on.
		dragSrc.innerHTML = this.innerHTML;
		this.innerHTML = e.dataTransfer.getData('text/html');
	}

	return false;
}

function handleDragEnd(e) {
	// this/e.target is the source node.
	var allParagraphs = document.querySelectorAll('p');
	[].forEach.call(allParagraphs, function (para) {	// remove class over from all paragraphs
		para.classList.remove('over');
		para.style.opacity = 1;
	});
}


function showTooltip(e) {
	var tooltip = document.getElementById('tooltip');
	tooltip.style.left = e.pageX;		// set x coordinate
	tooltip.style.top = e.pageY;		// set y coordinate
	tooltip.style.display = 'block';	// display tooltip
	selToChange = window.getSelection();
}
// // DRAG EVENT HANDLERS END

// TOOLTIP
var tooltipOptions = document.querySelectorAll('.tooltip-option');
[].forEach.call(tooltipOptions, function(option) {
	option.addEventListener('click', function(e) {	// addEventListener to all the tooltip options
		if (e.target.id === 'tooltip-bold') {
			document.execCommand('bold');
		} else if (e.target.id === 'tooltip-und') {
			document.execCommand('underline');
		} else if (e.target.id === 'tooltip-red') {
			//											textNode	SPAN OR P
			var parentNodeColor = window.getSelection().anchorNode.parentElement.style.color;
			if (parentNodeColor === '') {	// not already red
				document.execCommand('styleWithCSS', false, true);
				document.execCommand('foreColor', false, "rgb(255,0,0)");		// make it red
			} else {	// already red
				document.execCommand('styleWithCSS', false, true);				// remove red color
				document.execCommand('foreColor', false, "rgb(0,0,0)");					
			}
		}
		document.getElementById('tooltip').style.display = 'none';
	}, false);
});

// // LINKS
// return all the text under the element el
function textUnder(el) {
	var n;
	var walk = document.createTreeWalker(el,NodeFilter.SHOW_TEXT, null, false);
	var text = [];
	while (n = walk.nextNode()) {
		text.push(n.textContent);
	}
	return text.join('');
}

// places all text of the form /<a>.*?<\/a>/ eg. <a>what is this</a> and places it in a dedicated links div
function consolidateLinks() {
	var linksdiv = document.getElementById('links');
	var allParagraphs = document.querySelectorAll('p');
	var content = '';
	// join the text of all the paragraphs
	[].forEach.call(allParagraphs, function(para) {
		content += textUnder(para);
	});

	var links = content.match(/<a>.*?<\/a>/g) || [];	// match with the pattern
	[].forEach.call(links, function(link) {		// foreach pattern found
		link = link.replace(/<a>/g, '');		// remove '<a>'
		link = link.replace(/<\/a>/g, '');		// remove '</a>'

		var newdiv = document.createElement('div');	// create div
		var newlink = document.createElement('a');	// create an anchor tag
		newlink.appendChild(document.createTextNode(link));	// append text in the anchor tag
		newdiv.appendChild(newlink);	// append anchor to new div
		linksdiv.appendChild(newdiv);	// append newdiv to linksdiv
	});
}

// function to remove all links from the linksdiv
function clearAllLinks() {
	var linksdiv = document.getElementById('links');
	while (linksdiv.firstChild) {
	    linksdiv.removeChild(linksdiv.firstChild);	// remove firstchild fo linksdiv
	}
}

// add eventListener to the checkbox
document.getElementById('check-editable').addEventListener('click', function() { 
	var allParagraphs = document.querySelectorAll('p.notepad-paragraph');
	if (this.checked) {
		clearAllLinks();	// remove links from links div
		[].forEach.call(allParagraphs, function(para) {
			para.setAttribute('contenteditable', true);
			para.setAttribute('draggable', false);
		});
	} else {
		consolidateLinks();	// add links to linksdiv
		[].forEach.call(allParagraphs, function(para) {
			para.setAttribute('contenteditable', false);
			para.setAttribute('draggable', true);
		});
	}
}, false);

// randomizing
document.getElementById('randomize').addEventListener('click', function() {
	var allParagraphs = document.querySelectorAll('p.notepad-paragraph');
	[].forEach.call(allParagraphs, function(para) {	// foreach paragraph
		var html = para.innerHTML;
		console.log(html);
		var fourLettered = html.match(/\b[a-zA-Z]{4}\b/g) || [];	// get all 4 lettered words
		[].forEach.call(fourLettered, function(word) {	// for each 4-lettered word
			if (word === 'span') {
				return ;
			}
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {	// callback
				if (xhttp.readyState == 4 && xhttp.status == 200) {
				 	html = html.replace(word, xhttp.responseText);
				 	para.innerHTML = html;	// replace html of paragraph in closure with each response
				}
			};
			xhttp.open("GET", "http://randomword.setgetgo.com/get.php", true);
			xhttp.send();
		});
	});
}, false);