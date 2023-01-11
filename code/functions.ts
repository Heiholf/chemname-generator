export function reverseString(str: string) {
  return str.split('').reverse().join('')
}

/**
 * Finds the maximum value of an element in an array and returns the index of that element.
 *
 * @param arr The array of which the maximum should be found
 * @returns The index of the highest value in the array
 */
export function index_of_max_value_in_array<T>(arr: Array<T>): number {
  return arr.reduce(
    (iMax: number, x: T, i: number, arr: Array<T>) =>
      x > arr[iMax] ? i : iMax,
    0
  )
}

/**
 * Replaced the last occurence of any of the given search values with the replacementValue.\
 * "any of the given search values" => only the last ocurrence of any of the strings is replaced not the last occurence of each one.
 *
 * **Example:**\
 * str = "11223311"\
 * searchValues = ["22", "3"]\
 * replacementValue = "aa"\
 *
 * returns "11223aa11" (only the last "3" is replaced because the other "3" and the "22" come before)
 *
 * @param str The string to be checked
 * @param searchValues The strings of which the one with the last occurence should be replaced
 * @param replacementValue The string to replace the last matched string
 * @returns Copy of "str" with the last string replaced
 */
export function replace_last_occurence_of_any_substring_in_string(
  str: string,
  searchValues: Array<string>,
  replacementValue: string
): string {
  let starts: Array<number> = searchValues.map((x: string) =>
    str.lastIndexOf(x)
  )
  let latest_index: number = index_of_max_value_in_array(starts)
  let start: number = starts[latest_index]
  return (
    str.slice(0, start) +
    replacementValue +
    str.slice(start + searchValues[latest_index].length)
  )
}

/**
 * Removed all the innermost delimiter pairs in a string locally.
 * Locally means that it removes all delimiter pairs with no other delimiter pait inside of it and not the delimiter pair with the most global depth.
 *
 * @param str The string to be checked
 * @param start_delimiter The opening delimiting character *(default: "(")*
 * @param end_delimiter The closing delimiting character *(default: ")")*
 * @returns Copy of "str" with the innermost delimiter pair removed
 */
export function remove_innermost_delimiter_pair_from_string(
  str: string,
  start_delimiter: string = '(',
  end_delimiter: string = ')'
): string {
  let indices_to_be_removed: Array<number> = []
  let last_start_delimiter_index: number | undefined = undefined
  for (let i = 0; i < str.length; i++) {
    let c: string = str[i]
    if (c == start_delimiter) {
      last_start_delimiter_index = i
      continue
    }
    if (last_start_delimiter_index == undefined) {
      continue
    }
    if (c == end_delimiter) {
      indices_to_be_removed.push(last_start_delimiter_index!)
      indices_to_be_removed.push(i)
      last_start_delimiter_index = undefined
    }
  }

  let result = str
  for (let i = indices_to_be_removed.length - 1; i >= 0; i--) {
    result =
      result.slice(0, indices_to_be_removed[i]) +
      result.slice(indices_to_be_removed[i] + 1)
  }
  return result
}
