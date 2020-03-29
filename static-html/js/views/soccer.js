const onLoad = () => {
  const soccerElt = document.querySelector('#soccer');

  clear(soccerElt);
  addText(soccerElt, 'Soccer');
  addChildElement(soccerElt, 'br');
  const svgElt = addChildSvgElement(soccerElt, 'svg', {
    'width': '600',
    'height': '300',
    'stroke': 'black',
    'stroke-width': '4',
    'style': 'background-color:gray',
  });

  // left goal
  addChildSvgElement(svgElt, 'rect', {
    'y': '100',
    'x': '10',
    'width': '40',
    'height': '100',
    'fill': 'green',
  });

  // right goal
  addChildSvgElement(svgElt, 'rect', {
    'y': '100',
    'x': '550',
    'width': '40',
    'height': '100',
    'fill': 'green',
  });

  // field
  addChildSvgElement(svgElt, 'rect', {
    'y': '10',
    'x': '50',
    'width': '500',
    'height': '280',
    'fill': 'green',
    'onclick': 'return selectPlayer(undefined)',
  });

  // field decorations
  addChildSvgElement(svgElt, 'line', {
    'x1': '50',
    'x2': '550',
    'y1': '150',
    'y2': '150',
    'stroke-dasharray': '10 5',
  });
  addChildSvgElement(svgElt, 'line', {
    'x1': '300',
    'x2': '300',
    'y1': '10',
    'y2': '290',
  });
  addChildSvgElement(svgElt, 'circle', {
    'cx': '300',
    'cy': '150',
    'r': '50',
    'fill': 'none',
  });

  addRedPlayer(svgElt, 100, 90);
  addRedPlayer(svgElt, 200, 90);
  addRedPlayer(svgElt, 100, 190);
  addRedPlayer(svgElt, 200, 190);

  addWhitePlayer(svgElt, 400, 105);
  addWhitePlayer(svgElt, 500, 105);
  addWhitePlayer(svgElt, 400, 205);
  addWhitePlayer(svgElt, 500, 205);

  addBall(svgElt, 300, 150);
};

const addRedPlayer = (svgElt, x, y) => {
  const gElt = addChildSvgElement(svgElt, 'g', {
    'transform': `translate(${x},${y})`,
  });
  addChildSvgElement(gElt, 'polygon', {
    'points': '15,5 25,20 5,20 15,5',
    'fill': 'red',
    'class': 'player unselected_player',
    'onclick': 'return selectPlayer(this)',
  });
};

const addWhitePlayer = (svgElt, x, y) => {
  addChildSvgElement(svgElt, 'circle', {
    'cx': `${x}`,
    'cy': `${y}`,
    'r': '10',
    'fill': 'white',
    'class': 'player unselected_player',
    'onclick': 'return selectPlayer(this)',
  });
};

const addBall = (svgElt, x, y) => {
  addChildSvgElement(svgElt, 'circle', {
    'cx': `${x}`,
    'cy': `${y}`,
    'r': '10',
    'fill': 'gray',
    'class': 'ball',
  });
};

const selectPlayer = (elt) => {
  const playerElts = [...document.getElementsByClassName('player')];
  playerElts.forEach((playerElt) => {
    playerElt.className.baseVal = 'player unselected_player';
  });
  if (elt) {
    elt.className.baseVal = 'player selected_player';
  }
  return false;
};
