path = require 'path'

module.exports =
  config:
    executable:
      type: 'string'
      default: 'ruby'

  activate: ->
    console.log 'activate linter-ruby'
