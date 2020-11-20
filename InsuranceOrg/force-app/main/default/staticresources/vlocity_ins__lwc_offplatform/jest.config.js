module.exports = {
  preset: "@lwc/jest-preset",
  moduleNameMapper: {
    "c/${lwc_name}": "<rootDir>/src/c/${lwc_name}/${lwc_name}",
    "^(c)/(.+)$": "<rootDir>/node_modules/via_components/elements/$2/src/$1/$2/$2"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!via_components)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/test/specs/"]
};