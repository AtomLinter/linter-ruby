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
        const fileText = textEditor.getText();
        const fileExtension = extname(filePath).substr(1);

        if (this.ignoredExtensions.includes(fileExtension)) {
          return [];
        }

        const execArgs = ['-wc', '-Eutf-8'];
        const execOpts = {
          stdin: fileText,
          stream: 'stderr',
          allowEmptyStderr: true,
        };
        const output = await helpers.exec(this.executablePath, execArgs, execOpts);
        if (textEditor.getText() !== fileText) {
          // File contents have changed, just tell Linter not to update messages
          return null;
        }
        const toReturn = [];
        let match = regex.exec(output);
        while (match !== null) {
          const msgLine = Number.parseInt(match[1] - 1, 10);
          const type = match[2] === 'warning' ? 'Warning' : 'Error';
          toReturn.push({
            range: helpers.rangeFromLineNumber(textEditor, msgLine),
            type,
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
