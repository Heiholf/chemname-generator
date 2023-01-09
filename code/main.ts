import Atom from './organic/atom'
import Molecule from './organic/molecule'

let pentane = Molecule.create.fromAlkane(5, [1, 3], [2])
console.log(pentane.generate_name())
pentane.deleteAtom(4)
console.log(pentane.generate_name())
