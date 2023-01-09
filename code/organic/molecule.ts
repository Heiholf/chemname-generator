import { LanguageSettings } from '../languages'
import LanguageHandler from '../language_handler'
import Numbers from '../numbers'
import Atom from './atom'
import { BondType } from './bond'

type BondTypeCallback<T> = {
  single: T
  double: T
  triple: T
}

type BondGroup = {
  [key in number]: BondType
}

type AtomDict = {
  [key in number]: Atom
}

class Molecule {
  atoms: AtomDict
  current_highest_atom_index: number
  bonds: Record<number, BondGroup>

  constructor(atoms: Array<Atom>, bonds: Record<number, BondGroup>) {
    this.atoms = atoms
    this.bonds = bonds
    this.current_highest_atom_index = 0
  }

  private get atom_count() {
    return Object.keys(this.atoms).length
  }

  public addAtom(new_atom: Atom): void {
    this.atoms[this.current_highest_atom_index + 1] = new_atom
    this.current_highest_atom_index++
  }

  private addOneDirectionalBond(
    start: number,
    end: number,
    type: BondType = 'single'
  ) {
    if (start in this.bonds) {
      this.bonds[start][end] = type
      return
    }
    this.bonds[start] = { [end]: type }
  }

  public addBond(start: number, end: number, type: BondType = 'single'): void {
    this.addOneDirectionalBond(start, end, type)
    this.addOneDirectionalBond(end, start, type)
  }

  private find_most_important_C_chain_part(
    start: number,
    direction: number
  ): Array<number> {
    // Checks if given bond is valid, probably unnecessary and causing extra computations
    /*let isValidStartingConnection = false
    for (let bondProps in this.bonds[start]) {
      if (this.bonds[start][bondProps].end == direction) {
        isValidStartingConnection = true
        break
      }
    }
    if (!isValidStartingConnection) {
      return []
    }*/
    let bondEndings: BondGroup = this.bonds[direction]
    let neighbours: Array<number> = Object.keys(bondEndings).map((x) => +x)
    let length: number = neighbours.length
    let longestChain: Array<number> = []
    for (let i = 0; i < length; i++) {
      let bond: BondType = bondEndings[i]
      if (neighbours[i] === start) {
        continue
      }
      let longestNeighbourChain = this.find_most_important_C_chain_part(
        direction,
        neighbours[i]
      )
      if (longestNeighbourChain.length > longestChain.length) {
        longestChain = longestNeighbourChain
      }
    }
    return [direction].concat(longestChain)
  }

  private get_C_chain_bonds(chain: Array<number>): Array<BondType> {
    if (chain.length == 0) {
      return []
    }
    let bonds: Array<BondType> = []
    for (let i: number = 0; i < chain.length; i++) {
      if (i + 1 < chain.length) {
        bonds.push(this.bonds[chain[i]][chain[i + 1]])
      }
    }
    return bonds
  }

  private compare_C_chain_importance(
    a: Array<number>,
    b: Array<number>
  ): boolean {
    let a_bonds: Array<BondType> = this.get_C_chain_bonds(a)
    let b_bonds: Array<BondType> = this.get_C_chain_bonds(b)

    let a_triple_count = a_bonds.filter((x) => x === 'triple').length
    let b_triple_count = b_bonds.filter((x) => x === 'triple').length

    if (a_triple_count > b_triple_count) {
      return true
    } else if (a_triple_count < b_triple_count) {
      return false
    }

    let a_double_count = a_bonds.filter((x) => x === 'double').length
    let b_double_count = b_bonds.filter((x) => x === 'double').length
    if (a_double_count > b_double_count) {
      return true
    } else if (a_double_count < b_double_count) {
      return false
    }

    let a_count = a_bonds.length
    let b_count = b_bonds.length

    return a_count >= b_count
  }

  private find_most_important_C_chain(): Array<number> {
    let startC: number | undefined = undefined
    for (let atom in this.atoms) {
      if (this.atoms[atom].symbol == 'C') {
        startC = +atom
        break
      }
    }
    if (startC === undefined) {
      throw Error()
    }
    let bondGroup: BondGroup = this.bonds[startC]
    if (bondGroup === undefined) {
      return [startC]
    }
    let neighbours: Array<number> = Object.keys(bondGroup).map((x) => +x)
    let length: number = neighbours.length
    if (neighbours == undefined || length == 0) {
      return [startC]
    }
    if (length == 1) {
      return [startC].concat(
        this.find_most_important_C_chain_part(startC, neighbours[0])
      )
    }
    if (length == 2) {
      return this.find_most_important_C_chain_part(startC, neighbours[0])
        .reverse()
        .concat(
          [startC],
          this.find_most_important_C_chain_part(startC, neighbours[1])
        )
    }

    let longest_chain: Array<number> = []
    let second_longest_chain: Array<number> = []

    for (let i = 0; i < neighbours.length; i++) {
      let chain: Array<number> = this.find_most_important_C_chain_part(
        startC,
        neighbours[i]
      )
      if (this.compare_C_chain_importance(chain, longest_chain)) {
        second_longest_chain = longest_chain
        longest_chain = chain
        continue
      }
      if (this.compare_C_chain_importance(chain, second_longest_chain)) {
        second_longest_chain = chain
      }
    }

    return longest_chain.concat([startC], second_longest_chain)
  }

  private get_bond_location_in_C_chain(
    chain: Array<BondType>
  ): BondTypeCallback<Array<number>> {
    let single_bond_locations: Array<number> = []
    let double_bond_locations: Array<number> = []
    let triple_bond_locations: Array<number> = []
    for (let i: number = 0; i < chain.length; i++) {
      let bond: BondType = chain[i]
      if (bond == 'double') {
        double_bond_locations.push(i + 1)
      } else if (bond == 'triple') {
        triple_bond_locations.push(i + 1)
      } else {
        single_bond_locations.push(i + 1)
      }
    }

    if (triple_bond_locations.length != 0) {
      if (
        triple_bond_locations[-1] - chain.length + 1 <
        triple_bond_locations[0]
      ) {
        triple_bond_locations.map((x: number) => x - chain.length + 1)
        double_bond_locations.map((x: number) => x - chain.length + 1)
        single_bond_locations.map((x: number) => x - chain.length + 1)
      }
    }
    if (double_bond_locations.length != 0) {
      if (
        double_bond_locations[-1] - chain.length + 1 <
        double_bond_locations[0]
      ) {
        triple_bond_locations.map((x: number) => x - chain.length + 1)
        double_bond_locations.map((x: number) => x - chain.length + 1)
        single_bond_locations.map((x: number) => x - chain.length + 1)
      }
    }
    return {
      single: single_bond_locations,
      double: double_bond_locations,
      triple: triple_bond_locations,
    }
  }

  public generate_name(): string | undefined {
    let language: LanguageSettings = LanguageHandler.Instance.language
    if (this.atom_count == 0) {
      return ''
    }

    let longest_chain: Array<number> = this.find_most_important_C_chain()
    let longest_chain_length: number = longest_chain.length
    let longest_chain_bonds: Array<BondType> =
      this.get_C_chain_bonds(longest_chain)

    let { single, double, triple } =
      this.get_bond_location_in_C_chain(longest_chain_bonds)

    let alcane_beginning =
      longest_chain_length in language.alcane_exceptions
        ? language.alcane_exceptions[longest_chain_length]
        : Numbers.number_to_string(longest_chain_length)

    let result: string = ''

    if (triple.length !== 0) {
      result = `-${triple.join(',')}-${
        triple.length >= 2 ? Numbers.number_to_string(triple.length) : ''
      }${language.alcine_ending}`
    }
    if (double.length !== 0) {
      result =
        `-${double.join(',')}-${
          double.length >= 2 ? Numbers.number_to_string(double.length) : ''
        }${language.alcene_ending}` + result
    }
    if (result === '') {
      result = language.alcane_ending
    }

    result = alcane_beginning.slice(0, alcane_beginning.length - 1) + result

    return result
  }
}

export default Molecule
