linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"

class LinterRuby extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec']

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: 'ruby -wc'

  executablePath: null

  errorStream: 'stderr'

  linterName: 'ruby'

  # A regex pattern used to extract information from the executable's output.
  regex:
    '.+:(?<line>\\d+):((?<warning> warning:)|(?<error>))(?<message>.+)'

  constructor: (editor)->
    super(editor)

    @rubyLinter = atom.config.observe 'linter-ruby.rubyExecutablePath', =>
      @executablePath = atom.config.get 'linter-ruby.rubyExecutablePath'

  destroy: ->
    super
    @rubyLinter.dispose()

module.exports = LinterRuby
