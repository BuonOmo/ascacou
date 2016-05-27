'use strict';

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

fillStack($('.stack:first'),'black',13);
fillStack($('.stack:last'),'white',13);
createBoard($('.board:first'),5);

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
