'use strict';

var boardSize = 5;
var boardCards = [4][4];

/**
 * Create a board by filling it with squares.
 * @param  DOM      board  the element on the dom to fill
 * @param  number   size   number of squares per line
 */
function createBoard (board,size) {
  // Width and height have 124 times the number of square px, plus 2 for each border
  $('.board').css('width',size*124+2+'px');
  $('.board').css('height',size*124+2+'px');
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var left = Math.round(100 * j/size);
      var bottom = Math.round(100 * i/size);
      $('<square></square>').css('left',left+'%').css('bottom',bottom+'%').appendTo('.board');
    }
  }
};

/**
 * Fill a stack with pawns.
 * @param   DOM     board   the element on the dom to fill
 * @param   string  color   the color can have two values, 'black' or 'white'
 * @param   number  number  number of pawns on the stack
 */
function fillStack (stack,color,number) {
  for (var i = 0; i < number; i++) {
    var percent = i+2;
    $(stack).append('<pawn class="'+color+'" style="bottom:'+percent+'%;left:'+percent+'%;"></pawn>');
  }
};

/**
 * Create 16 cards and append 8 to #player1 and 8 to #player2
 */
function shuffleCards () {
  for (var i = 0; i < 16; i++) {
    var player = Math.round(Math.random())+1;
    var color = [];
    var c = 0;
    for (var j = 1; j < 16; j*=2) {
      color[c++] = (i & j) ? 'black' : 'white';
    }
    $('<div class="card"></div>')
      .attr('value',i)
      .append('<div class="'+color[0]+' small-pawn" style="bottom:0%;left:50%"></div>')
      .append('<div class="'+color[1]+' small-pawn" style="bottom:50%;left:50%"></div>')
      .append('<div class="'+color[2]+' small-pawn" style="bottom:0%;left:0%"></div>')
      .append('<div class="'+color[3]+' small-pawn" style="bottom:50%;left:0%"></div>')
      .appendTo('#player'+player);
  }
  while ($('#player1 .card').length > 8) {
    $($('#player1 .card')[Math.round(Math.random()*$('#player1 .card').length)]).appendTo('#player2');
  }
  while ($('#player2 .card').length > 8) {
    $($('#player2 .card')[Math.round(Math.random()*$('#player2 .card').length)]).appendTo('#player1');
  }
}

shuffleCards();

fillStack($('.stack:first'),'black',13);
fillStack($('.stack:last'),'white',13);
createBoard($('.board:first'),boardSize);

$('.card').click(function () {
    $(this).addClass('done');
});

$('.card').on('animationstart', function (event) {
  var elmt = this;
  setTimeout(function () {
    var left, bottom;
    for (var i = 0; i < 4; i++) {
      bottom = !(i % 2) ? '50%' : '75%';
      left   =  (i > 1) ? '50%' : '75%';
      $($(elmt).children()[i])
        .css('bottom',bottom)
        .css('left',left)
        .css('margin','2%')
        .css('width','21%')
        .css('height','21%');
    }
  },1000);
})

$('pawn').draggable({
  containment: '.board .stack',
  stack: 'pawn',
  cursor: 'move',
  revert: true,
  revertDuration: 150,
  snap: 'square',
  snapTolerance: 10
});

$('square').droppable({
  accept: 'pawn',
  hoverClass: 'drop-hover',
  drop: handlerDrop
});

function handlerDrop (event, ui) {
  if (!$(this).is(':parent')) {
    ui.draggable.draggable( 'option', 'revert', false );
    ui.draggable.css('bottom','0');
    ui.draggable.css('left','0');
    ui.draggable.css('top','0');
    ui.draggable.css('right','0');
    ui.draggable.css('position','absolute');
    ui.draggable.draggable('disable');
    $(this).append(ui.draggable);
  }
}
