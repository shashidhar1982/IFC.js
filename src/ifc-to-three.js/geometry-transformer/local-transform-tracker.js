import { resetTransformData } from "./local-transform-reseter.js";
import {
  defaultValue as def,
  namedProps as n,
  pivots as p,
} from "../../utils/global-constants.js";

function trackLocalTransform(product, placement, property) {
  const transform = initializeTransform(product, property);
  const { locat, xAxis, yAxis, zAxis } = getTransform(placement);
  transform[p.locat].push(locat);
  transform[p.xAxis].push(xAxis);
  transform[p.yAxis].push(yAxis);
  transform[p.zAxis].push(zAxis);
}

function initializeTransform(product, property) {
  if (!product[property]) resetTransformData(product, property);
  return product[property];
}

function getTransform(placement) {
  const locat = getLocat(placement);
  const xAxis = getAxisX(placement);
  const zAxis = getAxisZ(placement);
  const yAxis = getAxisY(zAxis, xAxis);
  return { locat, xAxis, yAxis, zAxis };
}

function getLocat(placement) {
  if (isInvalid(placement[n.location])) return [0, 0, 0];
  const location = placement[n.location][n.coordinates];
  if (location.length === 2) location.push(0);
  return location;
}

function getAxisX(placement) {
  if (isInvalid(placement[n.refDirection])) return [1, 0, 0];
  let x = placement[n.refDirection][n.dirRatios];
  if (x.length === 2) x.push(0);
  return x;
}

function getAxisZ(placement) {
  if (isInvalid(placement[n.axis])) return [0, 0, 1];
  const z = placement[n.axis][n.dirRatios];
  if (z.length === 2) z.push(0);
  return z;
}

//In IFC the axis Y is implicit (computed from X and Z)

function getAxisY(X, Z) {
  return [
    X[1] * Z[2] - X[2] * Z[1],
    X[2] * Z[0] - X[0] * Z[2],
    X[0] * Z[1] - X[1] * Z[0],
  ];
}

function isInvalid(prop) {
  if (!prop || prop === def) return true;
  return false;
}

export { trackLocalTransform };
