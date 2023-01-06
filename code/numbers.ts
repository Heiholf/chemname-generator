import { reverseString } from './functions';
import Exceptions from './exceptions.js';

const tens_ending = 'deca';
const thirty_to_ninty_ending = 'conta';
const twentys_name = 'icosa';
const twentys_ending = 'cosa';
const hundreds_name = 'hecta';
const hundreds_ending = 'cta';
const thousands_name = 'kilia';
const thousands_ending = 'lia';

type NumberStringDict = Record<number, string>;

const one_digit_names: NumberStringDict = {
  0: '',
  1: 'hen',
  2: 'do',
  3: 'tri',
  4: 'tetra',
  5: 'penta',
  6: 'hexa',
  7: 'hepta',
  8: 'octa',
  9: 'nona',
};

const lone_one_digit_names: NumberStringDict = {
  ...one_digit_names,
  1: 'mono',
  2: 'di',
};

function one_digit_number_to_string(num: number): string {
  return lone_one_digit_names[num];
}

function two_digit_number_to_string(tens: number, ones: number): string {
  if (tens == 0) {
    return one_digit_names[ones];
  }
  if (tens == 1) {
    return one_digit_names[ones] + tens_ending;
  }
  if (tens == 2) {
    if (ones <= 1) {
      return one_digit_names[ones] + twentys_name;
    }
    return one_digit_names[ones] + twentys_ending;
  }
  return one_digit_names[ones] + one_digit_names[tens] + thirty_to_ninty_ending;
}

function three_digit_number_to_string(
  hundreds: number,
  tens: number,
  ones: number
): string {
  if (hundreds == 0) {
    return two_digit_number_to_string(tens, ones);
  }
  if (hundreds === 1) {
    return two_digit_number_to_string(tens, ones) + hundreds_name;
  }
  return (
    two_digit_number_to_string(tens, ones) +
    one_digit_number_to_string(hundreds) +
    hundreds_ending
  );
}

function four_digit_number_to_string(
  thousands: number,
  hundreds: number,
  tens: number,
  ones: number
): string {
  if (thousands == 0) {
    return three_digit_number_to_string(hundreds, tens, ones);
  }
  if (thousands === 1) {
    return three_digit_number_to_string(hundreds, tens, ones) + thousands_name;
  }
  return (
    three_digit_number_to_string(hundreds, tens, ones) +
    one_digit_number_to_string(thousands) +
    thousands_ending
  );
}

function number_to_string(num: number): string {
  if (num % 1 != 0 || num < 0) {
    throw Exceptions.NonPositiveIntegerNumberInName;
  }
  if (num >= 10_000) {
    return num.toString() + '-';
  }
  let digits: Array<number> = num
    .toString()
    .padStart(4, '0')
    .split('')
    .reverse()
    .map((c: string) => +c);

  return four_digit_number_to_string(
    digits[3],
    digits[2],
    digits[1],
    digits[0]
  );
}

console.log(number_to_string(500));
console.log(number_to_string(362));
console.log(number_to_string(222));
console.log(number_to_string(6223));

console.log(number_to_string(67223));
const Numbers: object = {
  number_to_string,
};

export default Numbers;
