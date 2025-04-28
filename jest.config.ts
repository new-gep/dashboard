module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // ou 'node' se for um projeto Node.js
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',   // Para arquivos TypeScript
    '^.+\\.js$': 'babel-jest',       // Para arquivos JS, transformados pelo Babel
  },
  transformIgnorePatterns: [
    "/node_modules/(?!pascalcase)"  // Ignora o pacote pascalcase
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
