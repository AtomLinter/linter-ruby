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
    if(!atom.packages.getLoadedPackages("linter")) {
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
    const regex = "(?<file>.+):(?<line>\\d+):\\s*(?<type>[\\w\\s\\-]+)[:,]?\\s*(?<message>.+)";
    return {
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: (activeEditor) => {
        const command = atom.config.get("linter-ruby.rubyExecutablePath");
        const file = activeEditor.getPath()
        const args = ["-wc", file];
        return helpers.exec(command, args, {stream: "stderr", cwd: file}).then(output =>
          helpers.parse(output, regex)
        );
      }
    };
  }
};
