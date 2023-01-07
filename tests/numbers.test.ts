import Numbers from '../code/numbers'

describe('Testing numbers.ts file:', () => {
  let tests: Record<number, string> = {
    1: 'mono',
    2: 'di',
    3: 'tri',
    4: 'tetra',
    5: 'penta',
    6: 'hexa',
    7: 'hepta',
    8: 'octa',
    9: 'nona',
    10: 'deca',
    11: 'undeca',
    12: 'dodeca',
    13: 'trideca',
    14: 'tetradeca',
    20: 'icosa',
    21: 'henicosa',
    22: 'docosa',
    23: 'tricosa',
    30: 'triaconta',
    31: 'hentriaconta',
    40: 'tetraconta',
    50: 'pentaconta',
    60: 'hexaconta',
    70: 'heptaconta',
    80: 'octaconta',
    90: 'nonaconta',
    100: 'hecta',
    101: 'henhecta',
    200: 'dicta',
    222: 'docosadicta',
    300: 'tricta',
    362: 'dohexacontatricta',
    400: 'tetracta',
    500: 'pentacta',
    600: 'hexacta',
    700: 'heptacta',
    800: 'octacta',
    900: 'nonacta',
    1000: 'kilia',
    2000: 'dilia',
    3000: 'trilia',
  }

  for (let input in tests) {
    let output: string = tests[input]
    test(`{${input} -> ${output}}`, () => {
      expect(Numbers.number_to_string(input)).toBe(output)
    })
  }
})
