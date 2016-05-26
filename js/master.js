$('pawn').draggable({
  containment: '.board .stack',
  cursor: 'move',
  revert: true,
  revertDuration: 70,
  snap: 'square',
  snapTolerance: 10
});

$('square').droppable({
  accept: 'pawn',
  hoverClass: 'drop-hover',
  drop: handlerDrop
});

function handlerDrop (event, ui) {
  // ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
  if (!$(this).is(':parent')) {
    ui.draggable.draggable( 'option', 'revert', false );
    ui.draggable.css('bottom','0');
    ui.draggable.css('left','0');
    ui.draggable.css('top','0');
    ui.draggable.css('right','0');
    ui.draggable.css('position','absolute');
    ui.draggable.draggable( 'disable' );
    $(this).append(ui.draggable);
  }
}
