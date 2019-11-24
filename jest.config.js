module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    // support the same @ -> src alias mapping in source code
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
