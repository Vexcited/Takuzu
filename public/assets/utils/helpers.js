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

/** @param {string[]} classes */
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
 * @param {keyof HTMLElementTagNameMap} tagName 
 * @param {{
 *   class?: string,
 *   children?: (
 *     | (
 *       | string
 *       | HTMLElement
 *     )[]
 *     | string
 *     | HTMLElement
 *   )
 * }} attributes
 */
export const createElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);

  for (const key in attributes) {
    if (key === "children") continue;
    element.setAttribute(key, attributes[key]);
  }

  if (attributes.children) {
    if (Array.isArray(attributes.children)) {
      for (const child of attributes.children) {
        element.appendChild(transformChildrenToNode(child));
      }
    }

    else element.appendChild(transformChildrenToNode(attributes.children));
  }

  return element;
};