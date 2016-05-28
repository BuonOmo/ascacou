'use strict';

var boardSize    = 5;
var canvasHeight = 900;
var canvasWidth  = 1300;

/**
 * All possible cards played on the boad, encoded on 8 bit this way :
 *
 * for a card with slots in this order ->
 * | A | B |
 * | C | D |
 *
 * and bits like — a b c d e f g h — (a is most significant bit)
 *
 *   - a, b, c and d are used to describe if slots are full or empty :
 * | X |   |
 * |   |   | is 0001
 *
 * | X | X |
 * |   |   | is 0011
 *
 * | X | X |
 * | X | X | is 1111
 *
 * slot 1 is encoder with d, 1 for full, 0 for empty.
 * slot 2 with c
 * slot 3 with b
 * slot 4 with a
 *
 * - e, f, g and h are used to describe color :
 * black is 1 and white is 0, the method is the same as abcd encoding
 * @type {Array}
 */
var cards = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const STACK_ENCODE = 0b11110000;
const CARD_ENCODE  = 0b00001111;

const A_FULL = 0b00010000;
const B_FULL = 0b00100000;
const C_FULL = 0b01000000;
const D_FULL = 0b10000000;

const A_BLACK = 0b0001;
const B_BLACK = 0b0010;
const C_BLACK = 0b0100;
const D_BLACK = 0b1000;

/**
 * @return boolean state of card at index <index> on the board
 */
function isFull(index) {
  return (cards[index] & STACK_ENCODE) == STACK_ENCODE;
};

/**
 * @return number  value of the encoded card
 */
function getCard(index) {
  return (cards[index] & CARD_ENCODE);
}

/**
 * Create a board by filling it with squares.
 * @param  DOM      board  the element on the dom to fill
 * @param  number   size   number of squares per line
 */
function createBoard (board,size) {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var left = Math.round(100 * j/size);
      var bottom = Math.round(100 * (size-i-1)/size);
      $('<square index="'+(size*i + j)+'"></square>')
        .css('left',left+'%')
        .css('bottom',bottom+'%')
        .appendTo('.board');
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
    var percent = i*6.3;
    $(stack).append('<pawn class="'+color+'" style="left:'+percent+'%;"></pawn>');
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
      .append('<div class="'+color[0]+' small-pawn" style="bottom:50%;left:0%"></div>')
      .append('<div class="'+color[1]+' small-pawn" style="bottom:50%;left:50%"></div>')
      .append('<div class="'+color[2]+' small-pawn" style="bottom:0%;left:0%"></div>')
      .append('<div class="'+color[3]+' small-pawn" style="bottom:0%;left:50%"></div>')
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

/**
 * toggle the class selected card on board elements.
 */
$('.card').hover(
  function () {
    if ($(this).is('.done')) {
      for (var i = 0; i < cards.length; i++) {
        if (isFull(i) && (getCard(i) == parseInt($(this).attr('value')))) {
          var index = cardsToBoardIndex(i);
          $('square[index = '+index+']').addClass('card-selected');
          index++;
          $('square[index = '+index+']').addClass('card-selected');
          index = cardsToBoardIndex(i)+boardSize;
          $('square[index = '+index+']').addClass('card-selected');
          index++;
          $('square[index = '+index+']').addClass('card-selected');
        }
      }
    }
  },
  function () {
    if ($(this).is('.done')) {
      for (var i = 0; i < cards.length; i++) {
        if (isFull(i) && (getCard(i) == parseInt($(this).attr('value')))) {
          var index = cardsToBoardIndex(i);
          $('square[index = '+index+']').removeClass('card-selected');
          index++;
          $('square[index = '+index+']').removeClass('card-selected');
          index = cardsToBoardIndex(i)+boardSize;
          $('square[index = '+index+']').removeClass('card-selected');
          index++;
          $('square[index = '+index+']').removeClass('card-selected');
        }
      }
    }
  }
);

$('.card').on('animationstart', function (event) {
  var elmt = this;
  setTimeout(function () {
    var left, bottom;
    for (var i = 0; i < 4; i++) {
      bottom = (i > 1) ? '50%' : '75%';
      left   = !(i % 2) ? '50%' : '75%';
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
    ui.draggable.draggable( 'option', 'revert', false )
      .css('bottom','')
      .css('left','')
      .css('top','')
      .css('right','')
      .css('position','absolute')
      .draggable('disable');
    $(this).append(ui.draggable);
    updateState();
  }
}

function updateState () {
  for (var i = 0; i < cards.length; i++) {
    if ($('square[index='+cardsToBoardIndex(i)+']').is(':parent')) {
      cards[i] = cards[i] | A_FULL;
      if ($('square[index='+(cardsToBoardIndex(i))+']>pawn').is('.black'))
				cards[i] = cards[i] | A_BLACK;
    }

    if ($('square[index='+(cardsToBoardIndex(i)+1)+']').is(':parent')) {
      cards[i] = cards[i] | B_FULL;
      if ($('square[index='+(cardsToBoardIndex(i)+1)+']>pawn').is('.black'))
				cards[i] = cards[i] | B_BLACK;
    }

    if ($('square[index='+(cardsToBoardIndex(i)+boardSize)+']').is(':parent')) {
      cards[i] = cards[i] | C_FULL;
      if ($('square[index='+(cardsToBoardIndex(i)+boardSize)+']>pawn').is('.black'))
				cards[i] = cards[i] | C_BLACK;
    }

    if ($('square[index='+(cardsToBoardIndex(i)+boardSize+1)+']').is(':parent')) {
      cards[i] = cards[i] | D_FULL;
      if ($('square[index='+(cardsToBoardIndex(i)+boardSize+1)+']>pawn').is('.black'))
        cards[i] = cards[i] | D_BLACK;
    }

    if (isFull(i)) {
      $('.card[value='+getCard(i)+']').addClass('done');
    }
  }
}


function cardsToBoardIndex(i) {
  return i + Math.floor(i/4);
}
/**
 * TODO: implement this if needed
 * return all indexes to check in the "cards" array
 * @param  number board_index  index that has been modified
 * @return array               indexes to check it cards
 */
/*
function toCheck(board_index) {
  var ret = [];
  if (board_index < 20)
  ret.push(index - Math.round(index/5));
}
*/
