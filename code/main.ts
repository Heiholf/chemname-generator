import { replace_last_occurence_of_any_substring_in_string } from './functions'
import Atom from './organic/atom'
import Molecule from './organic/molecule'

let pentane = Molecule.create.fromAlkane(6)
console.log(Object.keys(pentane.atoms).length)
let new_atoms: Array<number> = pentane.addAtoms(Array(4).fill(new Atom('C')))
pentane.addBond(new_atoms[0], 2, 'double')
pentane.addBond(new_atoms[1], new_atoms[0])
pentane.addBond(new_atoms[0], new_atoms[2])
pentane.addBond(new_atoms[2], new_atoms[3])
console.log(Object.keys(pentane.atoms).length)
console.log(pentane.bonds)
console.log(pentane.generate_name())
