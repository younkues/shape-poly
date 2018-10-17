# shape-poly  [![npm version](https://badge.fury.io/js/shape-poly.svg)](https://badge.fury.io/js/shape-poly)

![](./polygon.png)

Make CSS Polygon Shape

```sh
$ npm install shape-poly
```

## Options
```ts
import {poly, be, dom} from "shape-tri";

interface PolyInterface {
  side?: number;
  split?: number;
  strokeWidth: number | string;
  className?: string;
  starRadius?: number; // inner-radius(0 ~ 100%)
  container?: HTMLElement;
  direction?: DIRECTION;
  stroke?: string; // color
}

function poly(options: PolyInterface);
function dom(el: HTMLElement);
function be(el: HTMLElement, options: PolyInterface);
```


## How to Use

```html
<script src="//daybrush.github.io/shape-tri/release/latest/shapepoly.min.js"></script>
```
```html
<div class="triangle" data-side="5" data-stroke-width="11px" style="width: 100px"></div>
```
```js
import {poly, be, dom} from "shape-poly";

// 10 star
const el = poly({starRadius: 50, side: 10, strokeWidth: "5px"});

document.body.appendChild(el);

// change 10 star to 5 polygon
be(el, {side: 5, strokeWidth: "5px"})

// data-side
// data-star-radius
// data-stroke-width
// data-stroke
// data-fill
// data-direction
dom(document.querySelector(".triangle"));
```