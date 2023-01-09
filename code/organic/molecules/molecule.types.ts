import Atom from "../atom"
import { BondType } from "../bond"

export type BondTypeCallback<T> = {
  single: T
  double: T
  triple: T
}

export type BondGroup = {
  [key in number]: BondType
}

export type AtomDict = {
  [key in number]: Atom
}
