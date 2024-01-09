/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleFileExtensions: ['jx', 'json', 'ts'],
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000, //от этой ошибки! -> thrown: "Exceeded timeout of 5000 ms for a test.
  testRegex: '.e2e.test.ts$', //<-- чтобы запускались только файлы с расширением ".e2e.test.ts"
};
// флаги
// detectOpenHandles - закрывает открытые соединения, runInBand - что бы тесты запускались по очереди, forceExit - закрыть тесты поле выполнения
