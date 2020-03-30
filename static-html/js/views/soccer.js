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
    'style': 'background-color:darkgray',
  });

  // red goal
  const redGoalieRect = addChildSvgElement(svgElt, 'rect', {
    'y': '100',
    'x': '10',
    'width': '40',
    'height': '100',
    'fill': 'green',
    'stroke': 'pink',
  });

  // white goal
  const whiteGoalieRect = addChildSvgElement(svgElt, 'rect', {
    'y': '100',
    'x': '550',
    'width': '40',
    'height': '100',
    'fill': 'green',
    'stroke': 'gray',
  });

  // field
  const playerRect = addChildSvgElement(svgElt, 'rect', {
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

  addRedPlayer(svgElt, 100, 100, playerRect);
  addRedPlayer(svgElt, 200, 100, playerRect);
  addRedPlayer(svgElt, 100, 200, playerRect);
  addRedPlayer(svgElt, 200, 200, playerRect);
  addRedPlayer(svgElt, 50, 150, redGoalieRect);

  addWhitePlayer(svgElt, 400, 100, playerRect);
  addWhitePlayer(svgElt, 500, 100, playerRect);
  addWhitePlayer(svgElt, 400, 200, playerRect);
  addWhitePlayer(svgElt, 500, 200, playerRect);
  addWhitePlayer(svgElt, 550, 150, whiteGoalieRect);

  addBall(svgElt, 300, 150);
};

const addRedPlayer = (svgElt, x, y, boundaryElt) => {
  const dx = -12.5;
  const dy = -12.5;
  const x0 = x+dx;
  const y0 = y+dy;
  const gElt = addChildSvgElement(svgElt, 'g', {
    'data_x': x0,
    'data_y': y0,
    'boundary': getBoundaryStr(boundaryElt, dx, dy),
    'transform': `translate(${x0},${y0})`,
    'class': 'player unselected_player',
    'onclick': 'return selectPlayer(this)',
    'fill': 'red',
  });
  addChildSvgElement(gElt, 'polygon', {
    'points': '12.5,5 20,20 5,20 12.5,5',
  });
};

const addWhitePlayer = (svgElt, x, y, boundaryElt) => {
  const gElt = addChildSvgElement(svgElt, 'g', {
    'data_x': x,
    'data_y': y,
    'boundary': getBoundaryStr(boundaryElt, 0, 0),
    'transform': `translate(${x},${y})`,
    'class': 'player unselected_player',
    'onclick': 'return selectPlayer(this)',
    'fill': 'white',
  });
  addChildSvgElement(gElt, 'circle', {
    'r': '10',
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

const move = (elt, dx, dy) => {
  // console.log('STARTED move', elt, dx, dy);
  const boundary = JSON.parse(get(elt, 'boundary'));
  const dataX = get(elt, 'data_x');
  const dataY = get(elt, 'data_y');
  let x = parseFloat(dataX) + dx;
  let y = parseFloat(dataY) + dy;
  // console.log('INTERIM move STARTED boundary', boundary, x, y);
  if (x < boundary.x) {
    x = boundary.x;
  }
  if (x > boundary.x + boundary.width) {
    x = boundary.x + boundary.width;
  }
  if (y < boundary.y) {
    y = boundary.y;
  }
  if (y > boundary.y + boundary.height) {
    y = boundary.y + boundary.height;
  }
  // console.log('INTERIM move SUCCESS boundary', boundary, x, y);
  // console.log('INTERIM move', dataX, dataY, dx, dy, x, y);
  set(elt, 'transform', `translate(${x},${y})`);
  set(elt, 'data_x', x);
  set(elt, 'data_y', y);
  // console.log('SUCCESS move', elt);
};

const moveLeft = () => {
  // console.log('moveLeft');
  const selectedPlayerElt = document.querySelector('.selected_player');
  if (selectedPlayerElt) {
    displayErrorMessage();
    move(selectedPlayerElt, -10, 0);
  } else {
    displayErrorMessage('Select a Player');
  }
  return false;
};

const moveRight = () => {
  // console.log('moveRight');
  const selectedPlayerElt = document.querySelector('.selected_player');
  if (selectedPlayerElt) {
    displayErrorMessage();
    move(selectedPlayerElt, +10, 0);
  } else {
    displayErrorMessage('Select a Player');
  }
  return false;
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

const getBoundaryStr = (elt, dx, dy) => {
  return JSON.stringify(getBoundary(elt, dx, dy));
};

const getBoundary = (elt, dx, dy) => {
  return {
    'x': parseFloat(get(elt, 'x')) + dx,
    'y': parseFloat(get(elt, 'y')) + dy,
    'width': parseFloat(get(elt, 'width')),
    'height': parseFloat(get(elt, 'height')),
  };
};
