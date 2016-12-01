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
    const regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/g;
    return {
      name: 'Ruby',
      grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec'],
      scope: 'file',
      lintOnFly: true,
      lint: async (textEditor) => {
        const filePath = textEditor.getPath();
        const fileExtension = extname(filePath).substr(1);

        if (this.ignoredExtensions.includes(fileExtension)) {
          return [];
        }

        const execArgs = ['-wc', '-E utf-8'];
        const execOpts = {
          stdin: textEditor.getText(),
          stream: 'stderr',
        };
        const output = await helpers.exec(this.executablePath, execArgs, execOpts);
        const toReturn = [];
        let match = regex.exec(output);
        while (match !== null) {
          const msgLine = Number.parseInt(match[1] - 1, 10);
          toReturn.push({
            range: helpers.rangeFromLineNumber(textEditor, msgLine),
            type: match[2],
            text: match[3],
            filePath,
          });
          match = regex.exec(output);
        }
        return toReturn;
      },
    };
  },
};
