import { LanguageSettings } from '../languages'
import LanguageHandler from '../language_handler'
import Numbers from '../numbers'
import Atom from './atom'
import { BondType } from './bond'

interface MoleculeBondProps {
  end: number
  bond: BondType
}

class Molecule {
  atoms: Array<Atom>
  bonds: Record<number, Array<MoleculeBondProps>>

  constructor(
    atoms: Array<Atom>,
    bonds: Record<number, Array<MoleculeBondProps>>
  ) {
    this.atoms = atoms
    this.bonds = bonds
  }

  public addAtom(new_atom: Atom): void {
    this.atoms.push(new_atom)
  }

  private addOneDirectionalBond(
    start: number,
    end: number,
    type: BondType = 'single'
  ) {
    if (start in this.bonds) {
      this.bonds[start].push({ end: end, bond: type })
      return
    }
    this.bonds[start] = [{ end: end, bond: type }]
  }

  public addBond(start: number, end: number, type: BondType = 'single'): void {
    this.addOneDirectionalBond(start, end, type)
    this.addOneDirectionalBond(end, start, type)
  }

  private find_longest_C_chain_part(
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
    let neighbours: Array<MoleculeBondProps> = this.bonds[direction]
    let longestChain: Array<number> = []
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour: MoleculeBondProps = neighbours[i]
      if (neighbour.end === start) {
        continue
      }
      let longestNeighbourChain = this.find_longest_C_chain_part(
        direction,
        neighbour.end
      )
      if (longestNeighbourChain.length > longestChain.length) {
        longestChain = longestNeighbourChain
      }
    }
    return [direction].concat(longestChain)
  }

  public find_longest_C_chain(): Array<number> {
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
    let neighbours: Array<MoleculeBondProps> = this.bonds[startC]
    if (neighbours == undefined || neighbours?.length == 0) {
      return [startC]
    }
    if (neighbours.length == 1) {
      return [startC].concat(
        this.find_longest_C_chain_part(startC, neighbours[0].end)
      )
    }
    if (neighbours.length == 2) {
      return this.find_longest_C_chain_part(startC, neighbours[0].end)
        .reverse()
        .concat(
          [startC],
          this.find_longest_C_chain_part(startC, neighbours[1].end)
        )
    }

    let longest_chain: Array<number> = []
    let second_longest_chain: Array<number> = []

    for (let i = 0; i < neighbours.length; i++) {
      let chain: Array<number> = this.find_longest_C_chain_part(
        startC,
        neighbours[i].end
      )
      if (chain.length >= longest_chain.length) {
        second_longest_chain = longest_chain
        longest_chain = chain
        continue
      }
      if (chain.length > second_longest_chain.length) {
        second_longest_chain = chain
      }
    }

    return longest_chain.concat([startC], second_longest_chain)
  }

  public generate_name(): string | undefined {
    let language: LanguageSettings = LanguageHandler.Instance.language
    if (this.atoms.length == 0) {
      return ''
    }

    let longest_chain_length = this.find_longest_C_chain().length
    if (longest_chain_length in language.alcane_exceptions) {
      return (
        language.alcane_exceptions[longest_chain_length] +
        language.alcane_ending
      )
    }

    return (
      Numbers.number_to_string(longest_chain_length) + language.alcane_ending
    )
  }
}

export default Molecule
