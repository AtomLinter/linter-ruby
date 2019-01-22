'use babel';

import { join } from 'path';
// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';

const goodPath = join(__dirname, 'fixtures', 'good.rb');
const badPath = join(__dirname, 'fixtures', 'bad.rb');
const { lint } = require('../lib/main.js').provideLinter();

describe('The Ruby provider for Linter', () => {
  beforeEach(async () => {
    // Info about this beforeEach() implementation:
    // https://github.com/AtomLinter/Meta/issues/15
    const activationPromise = atom.packages.activatePackage('linter-ruby');

    await atom.packages.activatePackage('language-ruby');
    await atom.workspace.open(goodPath);

    atom.packages.triggerDeferredActivationHooks();
    await activationPromise;
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-ruby')).toBe(true));

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-ruby')).toBe(true));

  it('checks bad.rb and verifies the messages are correct', async () => {
    const editor = await atom.workspace.open(badPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(2);

    expect(messages[0].severity).toBe('warning');
    expect(messages[0].excerpt).toBe('assigned but unused variable - payload');
    expect(messages[0].location.file).toBe(badPath);
    expect(messages[0].location.position).toEqual([[1, 2], [1, 13]]);

    expect(messages[1].severity).toBe('error');
    expect(messages[1].excerpt).toBe('unexpected keyword_end, expecting end-of-input');
    expect(messages[1].location.file).toBe(badPath);
    expect(messages[1].location.position).toEqual([[12, 0], [12, 18]]);
  });

  it('checks good.rb and reports nothing wrong', async () => {
    const editor = await atom.workspace.open(goodPath);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });
});
