import { reverseString } from './functions'
import Exceptions from './exceptions'
import Languages, { LanguageSettings } from './languages'
import LanguageHandler from './language_handler'

function one_digit_number_to_string(num: number, lone: boolean = true): string {
  let language = LanguageHandler.Instance.language
  if (lone) {
    return language.lone_one_digit_names[num]
  }
  return language.one_digit_names[num]
}

function two_digit_number_to_string(
  tens: number,
  ones: number,
  lone: boolean = true
): string {
  let language = LanguageHandler.Instance.language
  if (tens == 0) {
    return one_digit_number_to_string(ones, lone)
  }
  if (tens == 1) {
    return language.one_digit_names[ones] + language.tens_ending
  }
  if (tens == 2) {
    if (ones <= 1) {
      return language.one_digit_names[ones] + language.twentys_name
    }
    return language.one_digit_names[ones] + language.twentys_ending
  }
  if (tens == 3) {
    return language.one_digit_names[ones] + language.thirty_ending
  }
  return (
    language.one_digit_names[ones] +
    language.one_digit_names[tens] +
    language.forty_to_ninty_ending
  )
}

function three_digit_number_to_string(
  hundreds: number,
  tens: number,
  ones: number
): string {
  let language = LanguageHandler.Instance.language
  if (hundreds == 0) {
    return two_digit_number_to_string(tens, ones, true)
  }
  if (hundreds === 1) {
    return (
      two_digit_number_to_string(tens, ones, false) + language.hundreds_name
    )
  }
  return (
    two_digit_number_to_string(tens, ones, true) +
    one_digit_number_to_string(hundreds, true) +
    language.hundreds_ending
  )
}

function four_digit_number_to_string(
  thousands: number,
  hundreds: number,
  tens: number,
  ones: number
): string {
  let language = LanguageHandler.Instance.language
  if (thousands == 0) {
    return three_digit_number_to_string(hundreds, tens, ones)
  }
  if (thousands === 1) {
    return (
      three_digit_number_to_string(hundreds, tens, ones) +
      language.thousands_name
    )
  }
  return (
    three_digit_number_to_string(hundreds, tens, ones) +
    one_digit_number_to_string(thousands, true) +
    language.thousands_ending
  )
}

function number_to_string(
  num: number,
  language: LanguageSettings = Languages.English
): string {
  if (num % 1 != 0 || num < 0) {
    throw Exceptions.NonPositiveIntegerNumberInName
  }
  if (num >= 10_000) {
    return num.toString() + '-'
  }
  if (num in language.number_exceptions) {
    return language.number_exceptions[num]
  }
  let digits: Array<number> = num
    .toString()
    .padStart(4, '0')
    .split('')
    .reverse()
    .map((c: string) => +c)

  return four_digit_number_to_string(digits[3], digits[2], digits[1], digits[0])
}

interface NumbersInterface {
  number_to_string: (x: number) => string
}

const Numbers: NumbersInterface = {
  number_to_string,
}

export default Numbers
