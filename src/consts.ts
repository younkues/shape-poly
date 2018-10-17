export const TOP = "top";
export const BOTTOM = "bottom";
export const LEFT = "left";
export const RIGHT = "right";
export type DIRECTION = "top" | "bottom" | "left" | "right";
export const REVERSE = {
  [TOP]: BOTTOM,
  [BOTTOM]: TOP,
  [LEFT]: RIGHT,
  [RIGHT]: LEFT,
};
export const POLY_CLASS = "__shape-poly";
export const SIDE_CLASS = `${POLY_CLASS}-side`;
export const POSITION_ABSOLUTE = "position:absolute;";
export const SIDE_CSS = `${POSITION_ABSOLUTE}width:100%;height:100%;border-radius:inherit;
background-color:inherit;transform-origin:inherit;`;
