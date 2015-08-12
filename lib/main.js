"use babel";

export default {
  config: {
    rubyExecutablePath: {
      type: "string",
      default: "ruby"
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
    const path = require("path");
    const regex = /.+:(\d+):\s*(.+)/;
    return {
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: (activeEditor) => {
        const command = atom.config.get("linter-ruby.rubyExecutablePath");
        const file = activeEditor.getPath();
        const cwd = path.dirname(file);
        const args = ["-wc", file];
        return helpers.exec(command, args, {stream: "stderr", cwd: cwd}).then(output => {
          const toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            toReturn.push({
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1])),
              type: "Error",
              text: matches[2],
              filePath: file
            });
          });
          return toReturn;
        });
      }
    };
  }
};
