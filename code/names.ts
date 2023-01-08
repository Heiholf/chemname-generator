import { ElementSymbol } from './constants'
import { LanguageSettings } from './languages'
import LanguageHandler from './language_handler'

export function elementSymbol_to_name(symbol: ElementSymbol): string {
  let language: LanguageSettings = LanguageHandler.Instance.language
  return language.atom_names[symbol]
}
