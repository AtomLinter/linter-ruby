path = require 'path'

module.exports =
  config:
    type: 'string'
    default: ''

  activate: ->
    console.log 'activate linter-ruby'
