import { off } from 'process'
import { LanguageSettings } from '../languages'
import LanguageHandler from '../language_handler'
import Numbers from '../numbers'
import Atom from './atom'
import { BondType } from './bond'
import { create as create_molecule } from './molecules/create'
import {
  AtomDict,
  BondGroup,
  BondTypeCallback,
} from './molecules/molecule.types'

class Molecule {
  atoms: AtomDict
  current_highest_atom_index: number
  bonds: Record<number, BondGroup>

  constructor(atoms: Array<Atom>, bonds: Record<number, BondGroup>) {
    this.atoms = atoms
    this.bonds = bonds
    this.current_highest_atom_index = atoms.length
  }

  public static create = create_molecule

  /**
   * Returns the number of atoms in the molecule.
   *
   * @returns {number} Number of atoms
   */
  private get atom_count(): number {
    return Object.keys(this.atoms).length
  }

  /**
   * Returns the number of bonds between atoms in the molecule.
   * Watch out! Returns the amount of bonds in the data structure,
   * which do not have to match the bonds in the actual molecule.
   *
   * @returns {number} Number of bonds
   */
  private get bond_count(): number {
    return Object.keys(this.bonds).length
  }

  /**
   * Adds a new atom to the molecule.
   *
   * @param {Atom} new_atom The atom to be added
   * @returns {number} The index of the new atom
   */
  public addAtom(new_atom: Atom): number {
    this.atoms[this.current_highest_atom_index + 1] = new_atom
    this.current_highest_atom_index++
    return this.current_highest_atom_index
  }

  /**
   * Updates the atom with the given index to be the given atom.
   *
   * @param index Index of the atom to be edited
   * @param edited_atom The new data for the atom
   */
  public editAtom(index: number, edited_atom: Atom): void {
    this.atoms[index] = edited_atom
  }

  /**
   * Deletes the atom from the molecule.
   * Does not delete bonds of the atom leading to problems.
   *
   * @param index The index of the atom to be deleted
   */
  public deleteAtomRaw(index: number): void {
    delete this.atoms[index]
  }

  /**
   * Deletes the atom from the molecule (including all the bonds).
   *
   * @param index The index of the atom to be deleted
   */
  public deleteAtom(index: number): void {
    this.deleteAtomRaw(index)
    delete this.bonds[index]
    for (let i: number = 0; i < this.bond_count; i++) {
      let bond: BondGroup = Object.values(this.bonds)[i]
      if (index in bond) {
        delete bond[index]
      }
    }
  }

  /**
   * Adds a bond from one atom to another but not vice versa.
   *
   * @param start The index of the atom where the bond starts
   * @param end The index of the atom where the bond ends
   * @param type The type of bond (default: "single")
   */
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

  /**
   * Adds a bond in between atoms in both directions.
   *
   * @param start The index of one of the atoms in the bond
   * @param end The index of the other atoms in the bond
   * @param type The type of bond (default: "single")
   */
  public addBond(start: number, end: number, type: BondType = 'single'): void {
    this.addOneDirectionalBond(start, end, type)
    this.addOneDirectionalBond(end, start, type)
  }

  /**
   * Deletes a bond in between one atom to another but not vice versa.
   *
   * @param start The index of the atom where the bond starts
   * @param end The index of the atom where the bond ends
   */
  public deleteBondRaw(start: number, end: number): void {
    delete this.bonds[start][end]
  }

  /**
   * Deletes the bond of two atoms in both directions.
   *
   * @param start The index of one of the atoms in the bond
   * @param end The index of the other atoms in the bond
   * @param type The type of bond (default: "single")
   */
  public deleteBond(start: number, end: number): void {
    this.deleteBondRaw(start, end)
    this.deleteBondRaw(end, start)
  }

  private find_most_important_C_chain_part(
    start: number,
    direction: number
  ): Array<number> {
    let bondEndings: BondGroup = this.bonds[direction]
    let neighbours: Array<number> = Object.keys(bondEndings).map((x) => +x)
    let length: number = neighbours.length
    let longestChain: Array<number> = []
    for (let i = 0; i < length; i++) {
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

  private get_side_chain_names_in_C_chain(chain: Array<number>) {
    let names: Record<number, string> = {}
    let language: LanguageSettings = LanguageHandler.Instance.language
    for (let i: number = 0; i < chain.length; i++) {
      let atom_index: number = chain[i]
      let bonds: BondGroup = this.bonds[atom_index]
      let bond_keys: Array<number> = Object.keys(bonds).map((x) => +x)
      for (let j: number = 0; j < bond_keys.length; j++) {
        let neighbour_atom_index: number = bond_keys[j]
        if (!(neighbour_atom_index in chain)) {
          let bond: BondType = bonds[neighbour_atom_index]
          this.deleteBond(atom_index, neighbour_atom_index)
          let side_chain: Array<number> = this.find_most_important_C_chain_part(
            atom_index,
            neighbour_atom_index
          )
          let side_chain_name: string = this.generate_name_of_chain(side_chain)
          this.addBond(atom_index, neighbour_atom_index, bond)
          //TODO: Does not work properly if alcane/-ene/-ine endings have different lengths
          side_chain_name =
            side_chain_name.slice(
              0,
              side_chain.length - language.alcane_ending.length - 1
            ) + language.side_chain_ending
          names[i] = side_chain_name
        }
      }
    }

    let name_key: Array<number> = Object.keys(names).map((x) => +x)
    for (let i in name_key) {
      let ikey: number = name_key[i]
      let ivalue: string = names[ikey]
      if (ivalue === undefined) continue
      let repetitions: Array<number> = [ikey]
      for (let j: number = +i + 1; j < name_key.length; j++) {
        let jkey: number = name_key[j]
        let jvalue: string = names[jkey]
        if (jvalue === undefined) continue
        if (ivalue === jvalue) {
          delete names[jkey]
          repetitions.push(jkey)
        }
      }
      if (repetitions.length > 1) {
        names[ikey] = Numbers.number_to_string(repetitions.length) + ivalue
      }
      names[ikey] = repetitions.sort().join(',') + '-' + names[ikey]
    }
    console.log(names)
    return Object.values(names).join('-')
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

        chain.reverse()
      }
    } else if (double_bond_locations.length != 0) {
      if (
        double_bond_locations[-1] - chain.length + 1 <
        double_bond_locations[0]
      ) {
        triple_bond_locations.map((x: number) => x - chain.length + 1)
        double_bond_locations.map((x: number) => x - chain.length + 1)
        single_bond_locations.map((x: number) => x - chain.length + 1)

        chain.reverse()
      }
    }
    return {
      single: single_bond_locations,
      double: double_bond_locations,
      triple: triple_bond_locations,
    }
  }

  private generate_name_of_chain(chain: Array<number>): string {
    let language: LanguageSettings = LanguageHandler.Instance.language
    if (chain.length == 0) {
      return ''
    }
    let longest_chain_length: number = chain.length
    let longest_chain_bonds: Array<BondType> = this.get_C_chain_bonds(chain)

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

    result = this.get_side_chain_names_in_C_chain(chain) + result

    return result
  }

  public generate_name(): string | undefined {
    let language: LanguageSettings = LanguageHandler.Instance.language
    if (this.atom_count == 0) {
      return ''
    }

    let longest_chain: Array<number> = this.find_most_important_C_chain()
    return this.generate_name_of_chain(longest_chain)
  }
}

export default Molecule
