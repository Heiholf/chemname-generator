import English from './languages/english'
import Deutsch from './languages/deutsch'

export interface LanguageSettings {
  tens_ending: string
  thirty_ending: string
  forty_to_ninty_ending: string
  twentys_name: string
  twentys_ending: string
  hundreds_name: string
  hundreds_ending: string
  thousands_name: string
  thousands_ending: string
  number_exceptions: Record<number, string>
  one_digit_names: Record<number, string>
  lone_one_digit_names: Record<number, string>
}

interface LanguagesInterface {
  English
  Deutsch
}

const Languages: LanguagesInterface = {
  English,
  Deutsch,
}

export default Languages
