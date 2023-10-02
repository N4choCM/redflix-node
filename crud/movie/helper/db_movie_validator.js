/**
 * @fileOverview Database movie validator.
 */

/**
 * @description The available types.
 */
const TYPES = ["ACTION", "SPORT", "ADVENTURE", "ROMANTIC", "COMEDY", "DOCUMENTARY", "HISTORIC", "CARTOON", "THRILLER"]

/**
 * Checks if the given type is valid.
 * @param {*} type The given type.
 */
const isTypeValid = async (type) => {
  const existingType = TYPES.includes(type);
  if (!existingType) {
    throw new Error(`${type} is an invalid type. Remember that the only available types are ${TYPES}.`);
  }
};

module.exports = {
  isTypeValid,
};