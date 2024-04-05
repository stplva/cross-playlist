export const getArraysIntersection = <T>(arrays: T[][]): T[] => {
  return arrays.reduce((a, b) => a.filter((c) => b.includes(c)))
}
