import Atom from './organic/atom'
import Molecule from './organic/molecule'

let pentane = Molecule.create.fromAlkane(6)
let new_atom: number = pentane.addAtom(new Atom('C'))
pentane.addBond(new_atom, 2)

console.log(pentane.bonds)
console.log(pentane.generate_name())
