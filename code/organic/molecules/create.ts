import Atom from '../atom'
import Molecule from '../molecule'

function fromAlkane(
  count: number,
  double_bond_locations: Array<number> = [],
  triple_bond_locations: Array<number> = []
): Molecule {
  let molecule: Molecule = new Molecule(Array(count).fill(new Atom('C')), {})
  let unassigned_bonds: Array<boolean> = Array(count).fill(true)
  double_bond_locations.forEach((location: number, i: number) => {
    if (location === count - 1) {
      return
    }
    molecule.addBond(location, location + 1, 'double')
    unassigned_bonds[location] = false
  })
  triple_bond_locations.forEach((location: number, i: number) => {
    if (location === count - 1) {
      return
    }
    molecule.addBond(location, location + 1, 'triple')
    unassigned_bonds[location] = false
  })
  unassigned_bonds.forEach((value: boolean, location: number) => {
    if (location === count - 1) {
      return
    }
    if (!value) {
      return
    }
    molecule.addBond(location, location + 1, 'single')
    unassigned_bonds[location] = true
  })
  return molecule
}

export const create = {
  fromAlkane: fromAlkane,
}
