// setup
var canvas  = getById('canvas');
var context = canvas.getContext("2d");
var cRect   = canvas.getBoundingClientRect();
var offsetX = cRect.left;
var offsetY = cRect.top;

var mousedown = Rx.Observable.fromEvent(canvas, 'mousedown');
var mousemove = Rx.Observable.fromEvent(canvas, 'mousemove');
var mouseup = Rx.Observable.fromEvent(canvas, 'mouseup');

var moving = mousedown.flatMap(function() {
  var drag = mousemove.takeUntil(mouseup);
  return drag
    .scan({prev: null, curt: null}, function(acc, v) {
    	return {
        prev: acc.curt,
        curt: v
      };
  	}).skip(1);
});

moving.subscribe(function(prevAndCurt) {
  var prevX = (prevAndCurt.prev.clientX - offsetX);
  var prevY = (prevAndCurt.prev.clientY - offsetY);
  var curtX = (prevAndCurt.curt.clientX - offsetX);
  var curtY = (prevAndCurt.curt.clientY - offsetY);

  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(curtX, curtY);
  context.lineWidth = 5;
  context.stroke();
  context.closePath();
});

/*
// mutable state values
var drawing = false;
var prevX   = 0;
var prevY   = 0;

// drag start
canvas.addEventListener('mousedown', function(e) {
  prevX = (e.clientX - offsetX);
  prevY = (e.clientY - offsetY);
  drawing= true;
});

// draw path
canvas.addEventListener('mousemove', function(e) {
  if (!drawing) { return; }

  var curtX = (e.clientX - offsetX);
  var curtY = (e.clientY - offsetY);

  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(curtX, curtY);
  context.lineWidth = 5;
  context.stroke();
  context.closePath();

  prevX = curtX;
  prevY = curtY;
});

// drag end
canvas.addEventListener('mouseup', function(e) {
  drawing = false;
});*/

function getById(ident) {
  return document.getElementById(ident);
}

var logEl = getById('log');
function log(e) {
  var curtTextRows = logEl.innerHTML.split('<br>');
  curtTextRows.splice(4, 1);
  curtTextRows.unshift(e.type + ' > ' + 'x: ' + e.clientX + ' / ' + 'y: ' + e.clientY);
  logEl.innerHTML = curtTextRows.join('<br>');
}
