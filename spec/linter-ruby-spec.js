'use babel';

import { join } from 'path';

const goodPath = join(__dirname, 'fixtures', 'good.rb');
const badPath = join(__dirname, 'fixtures', 'bad.rb');
const lint = require('../lib/main.js').provideLinter().lint;

describe('The Ruby provider for Linter', () => {
  beforeEach(() => {
    // Info about this beforeEach() implementation:
    // https://github.com/AtomLinter/Meta/issues/15
    const activationPromise = atom.packages.activatePackage('linter-ruby');

    waitsForPromise(() =>
      atom.packages.activatePackage('language-ruby').then(() =>
        atom.workspace.open(goodPath)));

    atom.packages.triggerDeferredActivationHooks();
    waitsForPromise(() => activationPromise);
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-ruby')).toBe(true),
  );

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-ruby')).toBe(true),
  );

  describe('checks bad.rb and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badPath).then(
          (openEditor) => { editor = openEditor; },
        ),
      );
    });

    it('verifies the messages are correct', () =>
      waitsForPromise(() =>
        lint(editor).then((messages) => {
          expect(messages.length).toBe(2);

          expect(messages[0].type).toBe('Warning');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].text).toBe('assigned but unused variable - payload');
          expect(messages[0].filePath).toBe(badPath);
          expect(messages[0].range).toEqual([[1, 2], [1, 13]]);

          expect(messages[1].type).toBe('Error');
          expect(messages[1].html).not.toBeDefined();
          expect(messages[1].text).toBe('unexpected keyword_end, expecting end-of-input');
          expect(messages[1].filePath).toBe(badPath);
          expect(messages[1].range).toEqual([[12, 0], [12, 18]]);
        }),
      ),
    );
  });

  describe('checks good.rb and', () => {
    it('reports nothing wrong', () =>
      waitsForPromise(() =>
        atom.workspace.open(goodPath).then(editor =>
          lint(editor).then((messages) => {
            expect(messages.length).toBe(0);
          }),
        ),
      ),
    );
  });
});
