import Atom from './organic/atom'
import Molecule from './organic/molecule'

let methane = new Molecule([new Atom('C')], [])

let pentane = new Molecule(Array(5).fill(new Atom('C')), {})

pentane.addBond(0, 1)
pentane.addBond(1, 2, 'double')
pentane.addBond(2, 3, 'triple')
pentane.addBond(3, 4)

let scuffed_octane = new Molecule(Array(8).fill(new Atom('C')), {})

scuffed_octane.addBond(0, 1, 'triple')
scuffed_octane.addBond(1, 2, 'single')
scuffed_octane.addBond(2, 3, 'double')
scuffed_octane.addBond(3, 4, 'double')
scuffed_octane.addBond(4, 5, 'single')
scuffed_octane.addBond(5, 6, 'double')
scuffed_octane.addBond(6, 7, 'single')

console.log(methane.generate_name())
console.log(scuffed_octane.generate_name())
