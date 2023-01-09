import Atom from './organic/atom'
import Molecule from './organic/molecule'

let methane = Molecule.create.fromAlkane(1)

let pentane = Molecule.create.fromAlkane(5, [2], [3])

let scuffed_octane = Molecule.create.fromAlkane(8, [3, 4, 6], [1])

//let mega_alcane = Molecule.create.fromAlkane(3456)

console.log(methane.generate_name())
console.log(scuffed_octane.generate_name())
//console.log(mega_alcane.generate_name())
