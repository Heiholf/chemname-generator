import { ElementSymbol } from '../constants'
import { elementSymbol_to_name } from '../names'

class Atom {
  name: string
  symbol: ElementSymbol

  constructor(symbol: ElementSymbol) {
    this.symbol = symbol
    this.name = elementSymbol_to_name(symbol)
  }
}

export default Atom
