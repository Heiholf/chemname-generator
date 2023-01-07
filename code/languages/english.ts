import { LanguageSettings } from '../languages'

const English: LanguageSettings = {
  tens_ending: 'deca',
  thirty_ending: 'triaconta',
  forty_to_ninty_ending: 'conta',
  twentys_name: 'icosa',
  twentys_ending: 'cosa',
  hundreds_name: 'hecta',
  hundreds_ending: 'cta',
  thousands_name: 'kilia',
  thousands_ending: 'lia',
  one_digit_names: {
    0: '',
    1: 'hen',
    2: 'do',
    3: 'tri',
    4: 'tetra',
    5: 'penta',
    6: 'hexa',
    7: 'hepta',
    8: 'octa',
    9: 'nona',
  },
  lone_one_digit_names: {
    0: '',
    1: 'mono',
    2: 'di',
    3: 'tri',
    4: 'tetra',
    5: 'penta',
    6: 'hexa',
    7: 'hepta',
    8: 'octa',
    9: 'nona',
  },
  number_exceptions: {
    11: 'undeca',
  },
}

export default English
