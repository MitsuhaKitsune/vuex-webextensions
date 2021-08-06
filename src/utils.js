/*
 *  Copyright 2018 - 2021 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

function filterObject(source, keys) {
  const newObject = {};

  keys.forEach((obj) => {
    const value = source[obj];

    if (typeof value !== 'undefined' && value) {
      newObject[obj] = value;
    }
  });

  return newObject;
}

export { filterObject };
