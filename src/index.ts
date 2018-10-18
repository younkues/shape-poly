import {
  BOTTOM, TOP, DIRECTION, SIDE_CLASS, POLY_CLASS,
  POSITION_ABSOLUTE, REVERSE, LEFT, RIGHT, SIDE_CSS
} from "./consts";

function splitUnit(text: string) {
  const matches = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(text);

  if (!matches) {
    return { unit: "", value: NaN };
  }
  const value = matches[2];
  const unit = matches[3];

  return { unit, value: parseFloat(value) };
}
function getTransformOrigin(strokeWidth: string | number, isVertical: boolean) {
  const x = isVertical ? strokeWidth : "50%";
  const y = isVertical ? "50%" : strokeWidth;

  return `transform-origin:${x} ${y};`;
}

function getHTML(no: number | string, style: string, content: string = "") {
  return `<div class="${SIDE_CLASS}${no}" style="${style}">${content}</div>`;
}
function makeDOM(tag: string, className: string) {
  const el = document.createElement(tag);

  el.className = className;
  return el;
}
function getSin(side: number) {
  // sin([n / 2] * 180 / n)
  return Math.sin(Math.floor(side / 2) * Math.PI / side);
}
function getCos(side: number) {
  // cos(180 / n)
  return Math.cos(Math.PI / side);
}
function getStarAngle(side: number, radius: number) {
  const cos = getCos(side);

  return 100 * cos <= radius ? 0 :
    Math.atan((cos - radius / 100) / Math.sin(Math.PI / side)) / Math.PI * 180;
}
function getSideSize(side: number, split: number,
                     starAngle: number, strokeWidth: string | number) {
  const starRatio = starAngle ? 1 / Math.cos(starAngle * Math.PI / 180) : 1;
  let ratio = 1 / split;

  if (side > 4) {
    const sin = Math.sin(Math.PI / side);
    const cos = Math.cos(Math.PI / side);

    if (side % 4 === 0) {
      // 2 * r * cos(180 / n) = w
      // 2 * r * sin(180 / n) = size
      ratio *= sin / cos;
    } else if (side % 2 === 0) {
      ratio *= sin;
    } else {
      // 2 * r * sin([n /2] * 180 / n) = w
      // 2 * r * sin(180 / n) = size
      ratio *= sin / getSin(side);
    }
  } else if (split === 1) {
    return "100%";
  }
  ratio *= starRatio;

  return `calc(100% * ${ratio} - ${strokeWidth} * ${ratio} + ${strokeWidth})`;
}
function getHeight(side: number, strokeWidth: string | number, isVertical: boolean) {
  if (side % 4 === 0) {
    return "100%";
  }
  const cos = getCos(side);

  let ratio = 0;
  if (side % 2 === 0) {
    // w * cos = h (vertical)
    // w / cos = h (horizontal)
    ratio = isVertical ? cos : 1 / cos;
  } else {
    const sin = getSin(side);

    if (isVertical) {
      // 2 * r * sin([n /2] * 180 / n) = w
      ratio = 0.5 / sin * (1 + cos);
    } else {
      // r * (1 + cos(180 / n)) = w
      ratio = 2 * 1 / (1 + cos) * sin;
    }
  }
  return `calc(100% * ${ratio} + ${strokeWidth} * ${1 - ratio})`;
}

function getFirstTransform(side: number, split: number, isVertical: boolean,
                           starAngle: number, strokeValue: number, strokeUnit: string) {
  const translateProperty = isVertical ? "X" : "Y";
  const cos = Math.cos(starAngle * Math.PI / 180);

  const arr = [];
  arr.push(`translate${translateProperty}(-${50 * cos * split}%)`);
  if (split > 1) {
    arr.push(`translate${translateProperty}(${strokeValue / 2 * (cos * split - 1)}${strokeUnit})`);
  }
  if (starAngle !== 0) {
    arr.push(`rotate(${starAngle}deg)`);
  }
  return `transform:${arr.join(" ")};`;
}

function getAttribute(el: HTMLElement, name: string) {
  return el.getAttribute(`data-${name}`) || undefined;
}
export function dom(el: HTMLElement) {
  const strokeWidth = getAttribute(el, "stroke-width");
  const stroke = getAttribute(el, "stroke");
  const direction = getAttribute(el, "direction") as DIRECTION;
  let side: string | number = getAttribute(el, "side");
  let split: string | number = getAttribute(el, "split");
  let starRadius: string | number = getAttribute(el, "star-radius");

  side && (side = parseFloat(side));
  split && (split = parseFloat(split));
  starRadius && (starRadius = parseFloat(starRadius));

  return poly({
    side: (side as number),
    split: (split as number),
    starRadius: (starRadius as number),
    strokeWidth, direction, stroke, container: el});
}
interface PolyInterface {
  side?: number ;
  split?: number;
  strokeWidth: number | string;
  className?: string;
  starRadius?: number;
  container?: HTMLElement;
  direction?: DIRECTION;
  stroke?: string;
}
export function css({
  strokeWidth = 0,
  side = 3,
  split = 1,
  starRadius = 100,
  stroke = "black",
  direction = BOTTOM,
}: PolyInterface) {
  const splitCount = split * (starRadius === 100 ? 1 : 2);
  const { unit: strokeUnit, value: strokeValue } = splitUnit(`${strokeWidth}`);
  const half = `${strokeValue / 2}${strokeUnit}`;
  const reverseDirection = REVERSE[direction];
  const isVertical = direction === TOP || direction === BOTTOM;
  const directionProperty = isVertical ? LEFT : TOP;
  const otherDirectionProperty = isVertical ? TOP : LEFT;
  const padding = getHeight(side, strokeWidth, isVertical);
  const sign = direction === TOP || direction === RIGHT ? -1 : 1;
  const starAngle = starRadius === 100 ? 0 : getStarAngle(side, starRadius);
  const sideWidth = getSideSize(side, splitCount, starAngle, strokeWidth);
  const width = isVertical ? sideWidth : strokeWidth;
  const height = isVertical ? strokeWidth : sideWidth;
  const externalAngle = 360 / side + 2 * starAngle;
  const transformSplit = getFirstTransform(side, splitCount, isVertical, sign * starAngle, strokeValue, strokeUnit);
  const sides = [];

  sides.push(`${reverseDirection}:0;
  ${otherDirectionProperty}:auto;
  ${directionProperty}:50%;${transformSplit}${getTransformOrigin(half, isVertical)}
  width:${width};height:${height};border-radius:${half};background:${stroke};`);
  for (let i = 0; i < side; ++i) {
    for (let j = 0; j < splitCount; ++j) {
      const no = i * splitCount + j;

      if (no === 0) {
        continue;
      }
      const transform = j === 0 ? `transform:rotate(${sign * externalAngle}deg)` :
        (starAngle && j === splitCount / 2 ? `transform:rotate(${-sign * 2 * starAngle}deg)` : "transform:none;");

      sides.push(`${otherDirectionProperty}:auto;${directionProperty}: calc(100% - ${strokeWidth});${transform}`);
    }
  }
  return { sides, percent: `padding-top:${padding}` };
}
export function be(el: HTMLElement, {
  strokeWidth = 0,
  side = 3,
  starRadius = 100,
  stroke = "black",
  direction = BOTTOM,
}: PolyInterface) {
  const sideElements = el.querySelectorAll(`.${SIDE_CLASS}`);
  const length = sideElements.length;
  const split = length / (side * (starRadius !== 100 ? 2 : 1));
  if (!length || split % 1) {
    return;
  }
  const percentElement = el.querySelector(`.${SIDE_CLASS}-percent`);
  const {sides, percent} = css({strokeWidth, side, split, starRadius, stroke, direction});

  sides.forEach((sideCSS, i) => {
    (sideElements[i] as any).style.cssText += sideCSS;
  });
  (percentElement as any).style.cssText += percent;
}
export function poly({
  className = POLY_CLASS,
  strokeWidth = 0,
  side = 3,
  split = 1,
  starRadius = 100,
  stroke = "black",
  direction = BOTTOM,
  container = makeDOM("div", className),
}: PolyInterface) {
  const {sides, percent} = css({strokeWidth, side, split, starRadius, stroke, direction});
  let html;

  for (let i = sides.length - 1; i >= 1; --i) {
    html = getHTML(` ${SIDE_CLASS}${i}`, SIDE_CSS + sides[i], html);
  }
  html = getHTML(` ${SIDE_CLASS}0`, `${POSITION_ABSOLUTE}display:inline-block;${sides[0]}`, html);

  const percentHTML = getHTML("-percent", `position:relative;width:100%;${percent}`);

  const position = getComputedStyle(container).position;

  if (!position || position === "static") {
    container.style.position = "relative";
  }
  container.insertAdjacentHTML("beforeend", html + percentHTML);

  return container;
}

export const VERSION = "#__VERSION__#";
