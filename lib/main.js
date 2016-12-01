'use babel';

import * as helpers from 'atom-linter';
import { extname } from 'path';
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies
import { CompositeDisposable } from 'atom';

export default {
  activate() {
    require('atom-package-deps').install('linter-ruby');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-ruby.rubyExecutablePath',
      (value) => { this.executablePath = value; }));
    this.subscriptions.add(atom.config.observe('linter-ruby.ignoredExtensions',
      (value) => { this.ignoredExtensions = value; }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    const regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/;
    return {
      name: 'Ruby',
      grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec'],
      scope: 'file',
      lintOnFly: true,
      lint: async (activeEditor) => {
        const filePath = activeEditor.getPath();
        const fileExtension = extname(filePath).substr(1);

        if (this.ignoredExtensions.includes(fileExtension)) {
          return [];
        }

        const execArgs = ['-wc', '-E utf-8'];
        const execOpts = {
          stdin: activeEditor.getText(),
          stream: 'stderr',
        };
        const output = await helpers.exec(this.executablePath, execArgs, execOpts);
        const toReturn = [];
        output.split(/\r?\n/).forEach((line) => {
          const matches = regex.exec(line);
          if (matches === null) {
            return;
          }
          const msgLine = Number.parseInt(matches[1] - 1, 10);
          toReturn.push({
            range: helpers.rangeFromLineNumber(activeEditor, msgLine),
            type: matches[2],
            text: matches[3],
            filePath,
          });
        });
        return toReturn;
      },
    };
  },
};
