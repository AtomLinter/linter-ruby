"use babel";

export default {
  config: {
    rubyExecutablePath: {
      type: "string",
      default: "ruby"
    },
    ignoredExtensions: {
      type: 'array',
      default: ['erb', 'md'],
      items: {
        type: 'string'
      }
    }
  },

  activate: () => {
    // We are now using steelbrain's package dependency package to install our
    //  dependencies.
    require("atom-package-deps").install();
  },

  provideLinter: () => {
    const helpers = require("atom-linter");
    const Path = require("path");
    const regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/;
    return {
      name: "Ruby",
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: (activeEditor) => {
        const command = atom.config.get("linter-ruby.rubyExecutablePath");
        const ignored = atom.config.get("linter-ruby.ignoredExtensions");
        const filePath = activeEditor.getPath();
        const fileExtension = Path.extname(filePath).substr(1);

        for (let extension of ignored) {
          if (fileExtension === extension) return [];
        }

        return helpers.exec(command, ['-wc', '-Ku'], {stdin: activeEditor.getText(), stream: 'stderr'}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            toReturn.push({
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt((matches[1] - 1))),
              type: matches[2],
              text: matches[3],
              filePath: filePath
            });
          });
          return toReturn;
        });
      }
    };
  }
};
