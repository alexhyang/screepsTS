/**
 * Examine the given object
 *
 * @param  object
 */
const checkObject = (object: object) => {
  console.log("checking object...");
  console.log("Object:", object);
  console.log("Object type:", typeof object);
  console.log("Object keys:", Object.keys(object));
};

/**
 * Capitalize a string
 *
 * @param  str string to handle
 *
 * @returns  capitalized string
 */
const capitalize = (str: string): string => {
  if (str.length == 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Pad given string to a given length
 *
 * @param  str string to be padded
 * @param  maxLength max length after padding
 * @param  isPrefixPadding prefix padding to string if true, otherwise suffix padding to string
 * @param  padding the string as padding, default " "
 *
 * @returns Padded string with the given max length
 */
const padStr = (str: string, maxLength: number, isPrefixPadding = false, padding = " ") => {
  const padRepeat = maxLength - str.length;
  if (padRepeat <= 0) return str;
  if (isPrefixPadding) return padding.repeat(padRepeat) + str;
  return str + padding.repeat(padRepeat);
};

/**
 * Convert a number to thousands (e.g. 1200 -> 1.2)
 * @param  num
 * @param  numOfDecimalPlaces
 * @returns  the given number in thousands
 */
const convertNumToThousands = (num: number, numOfDecimalPlaces: number): number => {
  return roundTo(num / 1000, numOfDecimalPlaces);
};

/**
 * Convert a number to millions (e.g. 1,200,000 -> 1.2)
 * @param  num
 * @param  numOfDecimalPlaces
 * @returns  the given number in millions
 */
const convertNumToMillions = (num: number, numOfDecimalPlaces: number): number => {
  return roundTo(num / 1000000, numOfDecimalPlaces);
};

/**
 * @param  num
 * @param  numOfDecimalPlaces
 * @returns  the given number rounded to given number of decimal
 * places
 */
const roundTo = (num: number, numOfDecimalPlaces: number): number => {
  const multiplier = Math.pow(10, numOfDecimalPlaces);
  return Math.round(num * multiplier) / multiplier;
};

/**
 * @param  number
 * @returns  number with units "K", "M"
 */
const parseNumber = (number: number): string => {
  if (number >= 1000000) return convertNumToMillions(number, 2) + "M";
  if (number >= 1000) return convertNumToThousands(number, 2) + "K";
  if (number > -1000) return number.toString();
  if (number > -1000000) return "-" + convertNumToThousands(-number, 2) + "K";
  return "-" + convertNumToMillions(-number, 2) + "M";
};

export { checkObject, capitalize, padStr, roundTo, parseNumber };
