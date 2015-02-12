linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"

class LinterRuby extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec']

  errorStream: 'stderr'

  linterName: 'ruby'

  # A regex pattern used to extract information from the executable's output.
  regex:
    '.+:(?<line>\\d+):((?<warning> warning:)|(?<error>))(?<message>.+)'

  constructor: (editor)->
    super(editor)

    atom.config.observe 'linter-ruby.executable', => @updateCommand()

  destroy: ->
    atom.config.unobserve 'linter-ruby.executable'

  updateCommand: ->
    cmd = [atom.config.get 'linter-ruby.executable']
    cmd.push '-wc'
    @cmd = cmd

module.exports = LinterRuby
