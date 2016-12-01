'use babel';

export default {
  activate: () => {
    // We are now using steelbrain's package dependency package to install our
    //  dependencies.
    require('atom-package-deps').install();
  },

  provideLinter: () => {
    const helpers = require('atom-linter');
    const Path = require('path');
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
        const fileExtension = Path.extname(filePath).substr(1);

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
