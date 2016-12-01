'use babel';

import * as helpers from 'atom-linter';
import { extname } from 'path';

export default {
  activate: () => {
    require('atom-package-deps').install('linter-ruby');
  },

  provideLinter: () => {
    const regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/;
    return {
      name: 'Ruby',
      grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec'],
      scope: 'file',
      lintOnFly: true,
      lint: (activeEditor) => {
        const command = atom.config.get('linter-ruby.rubyExecutablePath');
        const ignored = atom.config.get('linter-ruby.ignoredExtensions');
        const filePath = activeEditor.getPath();
        const fileExtension = extname(filePath).substr(1);

        if (ignored.includes(fileExtension)) {
          return [];
        }

        return helpers.exec(command, ['-wc', '-E utf-8'], { stdin: activeEditor.getText(), stream: 'stderr' }).then((output) => {
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
        });
      },
    };
  },
};
