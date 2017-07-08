// functions used in the keydonw event

// add the document fragment to a new paragraph
addParagraph = function(frag) {
	// console.log(frag.textContent);
	var newp = document.createElement('p');	// create paragraph
	newp.classList.add('notepad-paragraph');	// add clsses
	newp.setAttribute('contenteditable', 'true');	// set attributes
	newp.appendChild(frag);	// append child
	insertAfter(newp, focusOn);	// add paragraph to body

	var children = newp.childNodes;
	[].forEach.call(children, function(child) {
		if (child.id === 'notepad') {
			newp.removeChild(child);
		}
	});

	// add focus blur and dblclick events
	newp.addEventListener('focus', pfocus, false);
	newp.addEventListener('blur', pblur, false);
	newp.addEventListener('dblclick', showTooltip, false);

	// add draggable eventListeners
	newp.addEventListener('dragstart', handleDragStart, false);
	newp.addEventListener('dragenter', handleDragEnter, false);
	newp.addEventListener('dragover', handleDragOver, false);
	newp.addEventListener('dragleave', handleDragLeave, false);
	newp.addEventListener('drop', handleDrop, false);
	newp.addEventListener('dragend', handleDragEnd, false);

	newp.focus();
	focusOn = newp;
}

placeCaretAtEnd = function(el) {	// places the caret at the end to element el
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
}

// extracts content from the start of the caret till the end of the 
extractContentsFromCaret = function() {
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var selRange = sel.getRangeAt(0);
        var blockEl = selRange.endContainer.parentNode;
        if (blockEl.tagName !== 'P') {		// this is the case when some style has been applied to the selection thus the
        	while (blockEl.nextSibling) {	// to get to the end _1_ <> _2_ <> _3_ <<>> _4_
        		blockEl = blockEl.nextSibling;	
        	}
        }
        if (blockEl.tagName == 'P') {
        	var range = selRange.cloneRange();
        	range.selectNodeContents(blockEl);
        	range.setStart(selRange.endContainer, selRange.endOffset);
        	return range.extractContents();
        	// return range.extractContents().textContent;
        }
    }
}

// insert newNode after node
insertAfter = function(newNode, node) {
	node.parentNode.insertBefore(newNode, node.nextSibling);
}

// fucntion determines whether or not we are at the start or end of the current paragraph
getPositionDetails = function() {
	var range = window.getSelection().getRangeAt(0);	// get the current cusor position
	var preRange = document.createRange();	// create a new range to deal with text before the caret
	preRange.selectNodeContents(focusOn);	// have this range select the entire contents of the editable div
	preRange.setEnd(range.startContainer, range.startOffset);	// set the end point of this range to the start point of the caret
	var this_text = preRange.cloneContents();	// fetch the contents of this range (text before the caret)
	at_start = this_text.textContent.length === 0;	// if the text's length is 0, we're at the start of the div.
	var postRange = document.createRange();	// repeat for text after the caret to determine if we're at the end.
	postRange.selectNodeContents(focusOn);
	postRange.setStart(range.endContainer, range.endOffset);
	var next_text = postRange.cloneContents();
	at_end = next_text.textContent.length === 0;
}

// appends required children to the 'focusOn' div and places caret @ appropriate position
appendChildAndPlaceCaret = function() {	
	var children = focusOn.childNodes;	// get all child nodes of the new element
	var textlast = children[children.length - 1];	// get last child of the new element
	var position = 0;
	if (textlast) {
		var position = textlast.textContent.length;	// get length of the text in the last child of the new element
	}

	focusOn.innerHTML += focusOn.nextSibling.innerHTML;	// append text from the backspaced div to the upper div
	notepad.removeChild(focusOn.nextSibling);	// remove the backspaced div

	// these lines place the caret @ the appropirate position in the upper div
	var range = document.createRange();
	range.setStart(textlast, position);
	range.setEnd(textlast, position);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

// DOCUMENT KEYDOWN
document.addEventListener('keydown', function(e) {

	if (focusOn) {	
		if (e.keyCode == 13) {	// code for enter key
			e.preventDefault();
			var frag = extractContentsFromCaret();	// get contents from the starting of caret to end of paragraph
			if (frag.textContent.charAt(0) == ' ') { // remove space if it si first character
				frag.textContent = frag.textContent.substring(1);
			}
			addParagraph(frag)
		}

		getPositionDetails();	// check if caret is at start or end of the focusOn paragraph
		if (at_start) {			// if @ start
			if (e.keyCode == 37 || e.keyCode == 38) {	// LEFT key
				// console.log('change focus backwards');
				e.preventDefault();
				if (focusOn.previousSibling !== null) {
					focusOn = focusOn.previousSibling;	// change focus to the end of the previous paragraph
					placeCaretAtEnd(focusOn);
				}
			}

			// code to merge the bottom paragraph with the paragraph above
			if (e.keyCode == 8) { // BACKSPACE key
				e.preventDefault(); // preven deletion of character
				focusOn = focusOn.previousSibling;
				focusOn.focus();	// bring focus to previous sibling
				appendChildAndPlaceCaret();
			}

		}

		if (at_end) {
			if (e.keyCode == 39 || e.keyCode == 40) {	// RIGHT key
				// console.log('change focus forward');
				e.preventDefault();
				if (focusOn.nextSibling != null) {
					focusOn = focusOn.nextSibling;	// change focus to the end of the previous paragraph
					focusOn.focus();				// place caret at the start of the new focusOn paragraph
				}
			}

			if (e.keyCode == 46) { // DELETE key
				e.preventDefault();	// prevent deletion of character
				appendChildAndPlaceCaret();
			}

		}

	}
}, false);