/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

function filterObject(source, keys) {
  const newObject = {};

  keys.forEach((obj) => {
    newObject[obj] = source[obj];
  });

  return newObject;
}

export { filterObject };
