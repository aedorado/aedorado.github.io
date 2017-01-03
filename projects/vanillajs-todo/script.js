// this is the task class
function Task(obj) {
	this.id = obj.id;
	this.details = obj.details;
	this.status = obj.status;
	this.addedOn = obj.addedOn;
	this.completedOn = obj.completedOn;
	// status  0 1 2
	// meaning d n c i.e. deleted new complete
	this.isNew = function() {	// tells if task is new
		return this.status == 1;
	},
	this.isComplete = function() {	// tells if task is complete
		return this.status == 2;
	},
	this.isDeleted = function () {	// tells if task is deleted
		return this.status == 0;
	},
	this.completeTask = function() {	// competes task by updating it's status
		if (this.status == 1) {
			this.completedOn = new Date().toString().substring(0, 24)
			this.status = 2;
		}
	},
	this.placeInNew = function(containerNum) {	// place task amongs incomplete tasks
		var container = document.getElementById('todo-task-container-' + containerNum);
		var newDiv = this.createComponent(false);
		container.appendChild(newDiv);
	},
	this.placeInComplete = function() {	// place tasks amongst complete tasks
		var container = document.getElementById('pane-done');
		var newDiv = this.createComponent(true);
		container.appendChild(newDiv);
	},

	this.draw = function(divNumber) {	// draw task in either new or complete
		if (this.isNew()) {
			this.placeInNew(divNumber);
			divNumber = (divNumber + 1) % 2;
		} else if (this.isComplete()) {
			this.placeInComplete();
		}
	}

	this.createComponent = function(complete) {
		// div for the text
		var textDiv = document.createElement('div');
		textDiv.classList.add('text-div');
		textDiv.appendChild(document.createTextNode(this.details));

		var dateDiv = document.createElement('div');
		dateDiv.classList.add('text-div');
		dateDiv.style.fontSize = 12;

		// create div to hold the task
		var div = document.createElement('div');
		div.classList.add('todo-task-container-n-div');
		div.id = 'div-' + this.id;
		if (!complete) { // choose random color
			var colors = ["D24D57", "F22613", "D91E18", "96281B", "EF4836", "D64541", "C0392B", "CF000F", "E74C3C", "DB0A5B", "F64747", "D2527F", "E08283", "F62459", "E26A6A", "663399", "674172", "AEA8D3", "913D88", "9A12B3", "BF55EC", "BE90D4", "8E44AD", "9B59B6", "446CB3", "4183D7", "59ABE3", "81CFE0", "52B3D9", "22A7F0", "3498DB", "2C3E50", "19B5FE", "336E7B", "22313F", "6BB9F0", "1E8BC3", "3A539B", "34495E", "67809F", "2574A9", "1F3A93", "89C4F4", "4B77BE", "5C97BF", "4ECDC4", "87D37C", "90C695", "26A65B", "03C9A9", "68C3A3", "65C6BB", "1BBC9B", "1BA39C", "66CC99", "36D7B7", "2ECC71", "16a085", "3FC380", "019875", "03A678", "4DAF7C", "2ABB9B", "00B16A", "1E824C", "049372", "26C281", "F89406", "EB9532", "E87E04", "F4B350", "F2784B", "EB974E", "F5AB35", "D35400", "F39C12", "F9690E", "F9BF3B", "F27935", "E67E22"];
			div.style.backgroundColor = colors[Math.floor((Math.random() * (colors.length - 1)) + 1)];
			dateDiv.appendChild(document.createTextNode('Added: ' + this.addedOn));
		} else if (complete) {
			div.addEventListener('dragenter', handleDragEnter, false);
			div.style.backgroundColor = '#777';
			dateDiv.appendChild(document.createTextNode('Completed: ' + this.completedOn));
		}
		// add draggable and handle dragstart and dragend events
		div.setAttribute('draggable', true);
		div.addEventListener('dragstart', handleDragStart, false);
		div.addEventListener('dragend', handleDragEnd, false);
		// append text to div
		div.appendChild(textDiv);
		div.appendChild(dateDiv);

		// create X to delete the entry
		var deleteSpan = document.createElement('span');
		deleteSpan.id = 'del-' + this.id;
		deleteSpan.classList.add('delete-span');
		deleteSpan.appendChild(document.createTextNode('X'));
		deleteSpan.addEventListener('click', deleteTask, false);

		div.appendChild(deleteSpan);
		return div;
	}

	// delete a task be changin status to 0
	function deleteTask(e) {
		var id = e.target.id.substring(4);
		// span -> div -> container-div
		var tasks = JSON.parse(localStorage.getItem('todoList')) || [];
		tasks[id].status = 0;	// change status to deleted
		localStorage.setItem('todoList', JSON.stringify(tasks));
		e.target.parentNode.parentNode.removeChild(e.target.parentNode);
		updateNumbers();
	}

}

//drag handlers
var dragSrc = null;
function handleDragStart(e) {
	this.style.opacity = 0.4;
	dragSrc = this;
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
	// this/e.target is the source node.
	this.style.opacity = 1;
	paneDone.style.opacity = 1;
}

// handle drag events on paneDone
var paneDone = document.getElementById('pane-done');
paneDone.addEventListener('dragenter', handleDragEnter, false);
paneDone.addEventListener('dragleave', handleDragLeave, false);
paneDone.addEventListener('dragover', handleDragOver, false);
paneDone.addEventListener('drop', handleDrop, false);

function handleDragEnter(e) {
	paneDone.style.opacity = 0.6;
}

function handleDragLeave(e) {
	e.preventDefault();
	// this.style.opacity = 1;
}

function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	e.dataTransfer.dropEffect = 'move';
	return false;
}

function handleDrop(e) {
	if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	}

	if (paneDone === this) {
		dragSrc.parentNode.removeChild(dragSrc);
		var tasks = JSON.parse(localStorage.getItem('todoList')) || [];
		tasks = revive(tasks);
		var id = dragSrc.id.substring(4);
		tasks[id].completeTask();
		tasks[id].draw();
		localStorage.setItem('todoList', JSON.stringify(tasks));
		updateNumbers();
	}

	return false;
}
// drag handlers end


// convert objects to those of type task so that we can 
// make use of utility functions defined in the Task class
function revive(tasks) {
	return tasks.map(function(task) {	
		return new Task(task);
	});
}

// place tasks at appropirate places
var divNumber = 0;
function placeTasks() {
	var tasks = JSON.parse(localStorage.getItem('todoList')) || [];
	tasks = revive(tasks);
	tasks.forEach(function(task) {
		// task.draw method places components on the page
		task.draw(divNumber);
		if (task.isNew()) {
			divNumber = (divNumber + 1) % 2;
		}
	});
	updateNumbers();
}
placeTasks();

// updates stats on page
function updateNumbers() {
	var tasks = JSON.parse(localStorage.getItem('todoList')) || [];
	tasks = revive(tasks);
	var countToComplete = 0;
	var countCompleted = 0;
	tasks.forEach(function(task) {
		if (task.isNew()) {
			countToComplete++;
		} else if (task.isComplete()) {
			countCompleted++;
		}
	});
	document.getElementById('completed-heading').innerHTML = countCompleted + ' task(s) completed in all.';
	document.getElementById('tocomplete-heading').innerHTML = countToComplete + ' task(s) remaining.';
}

// input stuff
var todoInputField = document.getElementById('todo-input');
todoInputField.addEventListener('keypress', handleTodoInput, false);
function handleTodoInput(e) {
	if (e.keyCode == 13) {
		if (e.target.value === '') {	// no input
			return ;
		}
		var tasks = JSON.parse(localStorage.getItem('todoList')) || [];
		// create fresh task
		var freshTask = new Task({
				id: tasks.length,
				details: e.target.value,
				status: 1,
				addedOn: new Date().toString().substring(0, 24),
				completedOn: new Date().toString().substring(0, 24)
			});
		freshTask.placeInNew(divNumber);
		divNumber = (divNumber + 1) % 2;
		tasks.push(freshTask);
		localStorage.setItem('todoList', JSON.stringify(tasks));
		updateNumbers();
		e.target.value = '';
	}
}


// remove all
document.getElementById('remove-all').addEventListener('click', removeAll, false);
function removeAll() {	// by triggering clicks on the spans with X
	var dismissButtons = document.querySelectorAll('#pane-done .todo-task-container-n-div span');
	[].forEach.call(dismissButtons, function(button) {
		button.click();
	})
}