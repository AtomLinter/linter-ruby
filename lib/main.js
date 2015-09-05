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
    // Because all of the grammars this linter supports are
    //  built into the editor we do not need to throw errors when
    //  any one of the grammmars isn't installed. If a user has the grammar
    //  disabled that is a choice they have made.

    // Show the user an error if they do not have an appropriate linter base
    //  package installed from Atom Package Manager. This will not be an issues
    //  after a base linter package is integrated into Atom, in the comming
    //  months.
    // TODO: Remove when Linter Base is integrated into Atom.
    if (!atom.packages.getLoadedPackages("linter")) {
      atom.notifications.addError(
        "Linter package not found.",
        {
          detail: "Please install the `linter` package in your Settings view."
        }
      );
    }
  },

  provideLinter: () => {
    const helpers = require("atom-linter");
    const Path = require("path");
    const regex = /.+:(\d+):\s*(.+?):\s(.+)/;
    return {
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
        };

        return helpers.exec(command, ['-wc'], {stdin: activeEditor.getText(), stream: 'stderr'}).then(output => {
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
