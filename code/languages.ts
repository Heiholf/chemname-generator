import English from './languages/english'
import { ElementSymbol } from './constants'

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
  atom_names: Record<ElementSymbol, string>
  alcane_ending: string
  alcene_ending: string
  alcine_ending: string
  alcane_exceptions: Record<number, string>
  side_chain_ending: string
  double_bond_side_chain_ending: string
  triple_bond_side_chain_ending: string //does not make sense chemically
}

interface LanguagesInterface {
  English: LanguageSettings
}

const Languages: LanguagesInterface = {
  English,
}

export default Languages
