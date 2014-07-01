path = require 'path'

module.exports =
  configDefaults:
    rubyExecutablePath: null

  activate: ->
    console.log 'activate linter-ruby'
