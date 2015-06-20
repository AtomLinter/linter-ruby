child_process = require 'child_process'
path = require 'path'

module.exports = LinterRuby =
  config:
    executablePath:
      default: 'ruby'
      type: 'string'

  activate: ->
    unless atom.packages.getLoadedPackages 'linter-plus'
      atom.notifications.addError(
        '[linter-ruby] `linter-plus` package not found, please install it')

  provideLinter: -> {
    grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec']
    scope: 'file'
    lint: @lint
    lintOnFly: false
  }

  lint: (TextEditor) ->
    regex = ///
      (.+): #File with issue
      (\d+):\s+ #Line with issue
      (\w+(?:\s(?:error|warning))?) #Issue type
      (?:,\s) #A command and space seperating the type and message
      (.+) #Message explaining the issue
    ///
    return new Promise (Resolve) ->
      filePath = TextEditor.getPath()
      if filePath # Files that have not be saved
        file = path.basename(filePath)
        cwd = path.dirname(filePath)
        cmd = atom.config.get "linter-ruby.executablePath"
        cmd = "#{cmd} -wc"
        cmd = "#{cmd} #{file}"
        console.log "linter-ruby command: #{cmd}" if atom.inDevMode()
        data = []
        process = child_process.exec cmd, {cwd: cwd}
        process.stderr.on 'data', (d) -> data.push d.toString()
        process.on 'close', ->
          toReturn = []
          for line in data
            console.log "linter-ruby output: #{line}" if atom.inDevMode()
            if line.match regex
              [file, line, type, message] = line.match(regex)[1..4]
              toReturn.push(
                type: type,
                text: message,
                filePath: path.join(cwd, file).normalize()
                range: [[line - 1, 0], [line - 1, 0]]
              )
          Resolve(toReturn)
