import Atom from './organic/atom'
import Molecule from './organic/molecule'

let methane = new Molecule([new Atom('C')], [])

let pentane = new Molecule(Array(5).fill(new Atom('C')), {})

pentane.addBond(0, 1)
pentane.addBond(1, 2)
pentane.addBond(1, 3)
pentane.addBond(1, 4)

console.log(methane.generate_name())
console.log(pentane.generate_name())
