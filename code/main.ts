import Atom from './organic/atom'
import Molecule from './organic/molecule'

let pentane = Molecule.create.fromAlkane(6)
let new_atoms: Array<number> = pentane.addAtoms(Array(3).fill(new Atom('C')))
pentane.addBond(new_atoms[0], 2)
pentane.addBond(new_atoms[1], new_atoms[0])
pentane.addBond(new_atoms[2], 4, 'double')
console.log(pentane.bonds)
console.log(pentane.generate_name())
