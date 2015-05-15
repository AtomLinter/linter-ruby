path = require 'path'

module.exports =
  config:
    rubyExecutablePath:
      default: ''
      type: 'string'

  activate: ->
    console.log 'activate linter-ruby'
