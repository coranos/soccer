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
  });

  // field decorations
  // addChildSvgElement(svgElt, 'line', {
  //   'x1': '0',
  //   'x2': '600',
  //   'y1': '150',
  //   'y2': '150',
  // });
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


  // html += '<circle cx="50" cy="50" r="10"  fill="yellow" />';

  // const soccer2Elt = document.querySelector('#soccer2');
  //
  // let html = '';
  // html += 'Soccer';
  // html += '<br>';
  // html += '<svg width="600" height="300" stroke="black" stroke-width="4" style="background-color:gray">';
  // html += '<rect y="12" x="10" width="100" height="100" fill="green"/>';
  // html += '<circle cx="50" cy="50" r="10"  fill="yellow" />';
  // html += '<g transform="translate(10,10)">';
  // html += '<polygon points="15,5 25,20 5,20 15,5" fill="red" />';
  // html += '</g>';
  // html += '</svg>';
  //
  // soccer2Elt.innerHTML = html;
};

const addRedPlayer = (svgElt, x, y) => {
  const gElt = addChildSvgElement(svgElt, 'g', {
    'transform': `translate(${x},${y})`,
  });
  addChildSvgElement(gElt, 'polygon', {
    'points': '15,5 25,20 5,20 15,5',
    'fill': 'red',
  });

  // html += '<g transform="translate(10,10)">';
  // html += '<polygon points="15,5 25,20 5,20 15,5" fill="red" />';
  // html += '</g>';
};
