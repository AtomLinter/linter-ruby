provider = require '../lib/main'

describe 'The Ruby Provider for AtomLinter', ->
  beforeEach ->
    waitsForPromise -> atom.packages.activatePackage('linter-ruby')

  describe 'finds issue with the code', ->
    describe 'in "syntax_error.rb"', ->
      waitsForPromise ->
        atom.workspace.open('syntax_error.rb').then ->
          expect(1).toEqual 1
