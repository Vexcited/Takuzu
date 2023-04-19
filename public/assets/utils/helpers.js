// @ts-check

/**
 * Compte le nombre d'occurrences de `substr` sur `str`.
 * 
 * @param {string} str
 * @param {string} substr
 */
export const countSubstrInStr = (str, substr) => str.split(substr).length - 1;

/**
 * @param {number} max 
 * @param {number} min 
 */
export const getRandomNumber = (max, min = 0) => {
  return Math.round(Math.random() * (max - min)) + min;
};

/**
 * @param {number} length 
 * @returns {string[]}
 */
export const arrayFromLength = (length) => {
  return Array.from(new Array(length).keys()).map(() => "");
};

export const getRandomBoolean = (chance = 0.5) => chance > Math.random();

/** @param {Array} arr */
export const takeRandomIndexFromArray = (arr) => Math.floor((Math.random() * arr.length));

/** @param {(string | boolean | undefined)[]} classes */
export const classNames = (...classes) => classes
  .filter(Boolean)
  .join(" ");

/** @param {string | HTMLElement} child */
const transformChildrenToNode = (child) => {
  if (typeof child === "string") {
    return document.createTextNode(child);
  }

  return child;
}

/**
 * @template {keyof HTMLElementTagNameMap} T 
 * @param {T} tagName 
 * @param {Record<string, string | undefined> & {
 *   class?: string
 * }} props
 * @param {(
 *   | (
 *     | string
 *     | HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
 *   )[]
 *   | string
 *   | HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
 * )} [children]
 * 
 * @returns {HTMLElementTagNameMap[T]}
 */
export const createElement = (tagName, props = {}, children) => {
  const element = document.createElement(tagName);

  for (const key in props) {
    const value = props[key];
    if (typeof value === "undefined") continue;
    element.setAttribute(key, value);
  }

  if (children) {
    if (Array.isArray(children)) {
      for (const child of children) {
        element.appendChild(transformChildrenToNode(child));
      }
    }

    else element.appendChild(transformChildrenToNode(children));
  }

  return element;
};

/** @param {HTMLElement} element */
export const renderToBody = (element) => element && document.body.appendChild(element);
