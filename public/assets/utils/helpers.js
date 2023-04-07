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