import { normalize, randomItem, shuffle } from "@danehansen/math";
import ImageDataReader, {
  WHITE_BRIGHTNESS,
  brightness as idrBrightness
} from "@danehansen/image-data-reader";

export const ASCII = [];
for (let i = 32; i <= 126; i++) {
  ASCII.push(String.fromCharCode(i));
}

export const CODE_PAGE_437 = "☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■".split(
  ""
);

function entitify(char) {
  switch (char) {
    case " ":
      return "&nbsp;";
    case '"':
      return "&quot;";
    case "'":
      return "&apos;";
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    default:
      return char;
  }
}

function sortByBrightness(a, b) {
  return a.brightness - b.brightness;
}

function getGridDimensions(node) {
  return new Promise(function(resolve) {
    const repeats = 20;
    let str = "";
    for (let i = 0; i < repeats; i++) {
      str += "W";
    }
    node.innerHTML = str;
    document.fonts.ready.then(function() {
      const columnWidth = node.offsetWidth / repeats;
      node.innerHTML = "W";
      const rowHeight = node.offsetHeight;
      resolve({ columnWidth, rowHeight });
    });
  });
}

function getBrightnessMap(
  computedStyle,
  columnWidth,
  rowHeight,
  charSet,
  inverse
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  document.body.appendChild(canvas);
  context.font = computedStyle.fontSize + " " + computedStyle.fontFamily;
  context.textAlign = "left";
  context.textBaseline = "top";

  const excess = 1;
  const columns = Math.ceil(columnWidth + excess);
  const rows = Math.ceil(rowHeight + excess);

  let backgroundColor;
  let color;
  if (inverse) {
    backgroundColor = "black";
    color = "white";
  } else {
    backgroundColor = "white";
    color = "black";
  }

  const characterBrightnesses = {};
  let lowBrightness = WHITE_BRIGHTNESS;
  let highBrightness = 0;
  for (const str of charSet) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, columns, rows);
    context.fillStyle = color;
    context.fillText(str, 0, 0);
    const { data } = context.getImageData(0, 0, columns, rows);
    let brightness = 0;
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < columns; k++) {
        brightness += idrBrightness(data, columns, k, j);
      }
    }
    brightness = brightness / (columns * rows);
    characterBrightnesses[str] = brightness;
    lowBrightness = Math.min(brightness, lowBrightness);
    highBrightness = Math.max(brightness, highBrightness);
  }
  document.body.removeChild(canvas);

  const brightnessMap = [];
  for (const str of charSet) {
    const brightness = characterBrightnesses[str];
    const normalizedBrightness = normalize(
      lowBrightness,
      highBrightness,
      brightness
    );
    const adjustedBrightness = Math.floor(
      normalizedBrightness * WHITE_BRIGHTNESS
    );
    brightnessMap[adjustedBrightness] = brightnessMap[adjustedBrightness] || [];
    brightnessMap[adjustedBrightness].push(entitify(str));
  }

  return fillInBrightnessGaps(brightnessMap);
}

function fillInBrightnessGaps(brightnessMap) {
  const emptyGroups = [];
  let currentEmptyGroup;
  for (let i = 0; i < WHITE_BRIGHTNESS; i++) {
    if (brightnessMap[i] === undefined) {
      currentEmptyGroup = currentEmptyGroup || [];
      currentEmptyGroup.push(i);
    } else {
      if (currentEmptyGroup) {
        emptyGroups.push(currentEmptyGroup);
        currentEmptyGroup = null;
      }
    }
  }
  if (currentEmptyGroup) {
    emptyGroups.push(currentEmptyGroup);
  }

  for (const emptyGroup of emptyGroups) {
    const low = emptyGroup[0];
    const high = emptyGroup[emptyGroup.length - 1];
    const middle = Math.round((high + low) / 2);
    let lowBrightness = brightnessMap[low - 1];
    let highBrightness = brightnessMap[high + 1];
    lowBrightness = lowBrightness || highBrightness;
    highBrightness = highBrightness || lowBrightness;
    for (let i = low; i < middle; i++) {
      brightnessMap[i] = lowBrightness;
    }
    for (let i = middle; i <= high; i++) {
      brightnessMap[i] = highBrightness;
    }
  }
  return brightnessMap;
}

export function getCharacterData(node, inverse, charSet = ASCII) {
  return new Promise(function(resolve) {
    const computedStyle = window.getComputedStyle(node);
    const { style } = node;
    const { display, height, width, position } = style;
    const { innerHTML } = node;
    style.width = "auto";
    style.height = "auto";
    style.position = "absolute";
    style.display = "inline-block";

    getGridDimensions(node).then(function({ columnWidth, rowHeight }) {
      node.innerHTML = innerHTML;
      style.display = display;
      style.width = width;
      style.position = position;
      style.height = height;

      resolve({
        columnWidth,
        rowHeight,
        brightnessMap: getBrightnessMap(
          computedStyle,
          columnWidth,
          rowHeight,
          charSet,
          inverse
        )
      });
    });
  });
}

function brightnessToChar(brightness, brightnessMap) {
  const a = brightnessMap[brightness];
  const b = randomItem(a);
  // const b = a[0];
  return b;
}

export function dataToString(idr, columns, rows, brightnessMap) {
  let str = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      str += brightnessToChar(
        Math.min(WHITE_BRIGHTNESS - 1, Math.max(0, idr.brightness(x, y))),
        brightnessMap
      );
      if (x === columns - 1 && y < rows - 1) {
        str += "<br/>";
      }
    }
  }
  return str;
}

export function doSomething({
  brightnessMap,
  columnWidth,
  destHeight,
  destWidth,
  fit,
  rowHeight,
  source,
  sourceHeight,
  sourceWidth
}) {
  const availableColumns = Math.floor(destWidth / columnWidth);
  const availableRows = Math.floor(destHeight / rowHeight);
  let scaledSourceWidth;
  let scaledSourceHeight;
  let scaledSourceColumns;
  let scaledSourceRows;
  let renderedColumns;
  let renderedRows;

  switch (fit) {
    case "contain":
    case "cover":
      switch (fit) {
        case "contain":
          if (sourceWidth / sourceHeight > destWidth / destHeight) {
            scaledSourceWidth = destWidth;
            scaledSourceHeight =
              (sourceHeight / sourceWidth) * scaledSourceWidth;
          } else {
            scaledSourceHeight = destHeight;
            scaledSourceWidth =
              (sourceWidth / sourceHeight) * scaledSourceHeight;
          }
          break;
        case "cover":
          if (sourceWidth / sourceHeight > destWidth / destHeight) {
            scaledSourceHeight = destHeight;
            scaledSourceWidth =
              (sourceWidth / sourceHeight) * scaledSourceHeight;
          } else {
            scaledSourceWidth = destWidth;
            scaledSourceHeight =
              (sourceHeight / sourceWidth) * scaledSourceWidth;
          }
          break;
      }
      scaledSourceColumns = Math.floor(scaledSourceWidth / columnWidth);
      scaledSourceRows = Math.floor(scaledSourceHeight / rowHeight);
      renderedColumns = Math.min(scaledSourceColumns, availableColumns);
      renderedRows = Math.min(scaledSourceRows, availableRows);
      break;
    // case "fill":
    default:
      scaledSourceColumns = renderedColumns = availableColumns;
      scaledSourceRows = renderedRows = availableRows;
  }

  const croppedSourceWidth = Math.round(
    (renderedColumns / scaledSourceColumns) * sourceWidth
  );
  const croppedSourceHeight = Math.round(
    (renderedRows / scaledSourceRows) * sourceHeight
  );

  const srcCrop = {
    width: croppedSourceWidth,
    height: croppedSourceHeight,
    x: Math.max(0, Math.round((sourceWidth - croppedSourceWidth) * 0.5)),
    y: Math.max(0, Math.round((sourceHeight - croppedSourceHeight) * 0.5))
  };
  const imageDataReader = new ImageDataReader(
    source,
    srcCrop,
    renderedColumns,
    renderedRows
  );
  imageDataReader.adjustContrast();
  return dataToString(
    imageDataReader,
    renderedColumns,
    renderedRows,
    brightnessMap
  );
}
