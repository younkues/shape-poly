# shape-tri  [![npm version](https://badge.fury.io/js/shape-tri.svg)](https://badge.fury.io/js/shape-tri)

Make CSS Triangle Shape

```sh
$ npm install shape-tri
```

## Options
```ts
import {tri, dom} from "shape-tri";

tri({
  strokeWidth: number | string,
  className?: string,
  container?: HTMLElement,
  fill?: string,
  direction?: string,
  stroke?: string
});

dom(el: HTMLElement);
```


## How to Use

```html
<script src="//daybrush.github.io/shape-tri/release/latest/shapetri.min.js"></script>
```
```html
<div class="triangle" data-stroke-width="11px" style="width: 100px"></div>
```
```js
import {tri, dom} from "shape-tri";

const el = tri({radius: "100px", strokeWidth: "5px"});

document.body.appendChild(el);


// data-stroke-width
// data-stroke
// data-fill
// data-direction
dom(document.querySelector(".triangle"));
```