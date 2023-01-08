import Atom from './organic/atom'
import Molecule from './organic/molecule'

let methane = new Molecule([new Atom('C')], [])

let pentane = new Molecule(Array(5).fill(new Atom('C')), {})

pentane.addBond(0, 1)
pentane.addBond(1, 2, 'double')
pentane.addBond(2, 3, 'triple')
pentane.addBond(3, 4)

console.log(pentane.generate_name())
