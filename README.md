# linter-ruby

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides
an interface to Ruby's builtin syntax analysis. It will be used with files that
have the `Ruby` syntax.

## Installation

On first activation the plugin will install all dependencies automatically, you
no longer have to worry about installing Linter.

Just install this package and you'll be good to go.

## Settings

You can configure linter-ruby by editing `~/.atom/config.cson` (choose Open
Your Config in Atom menu):

```coffeescript
'linter-ruby':
  # ruby path. run `which ruby` to find the path.
  'rubyExecutablePath': null

  # ignored extensions, ERB and markdown files by default.
  'ignoredExtensions': 'erb, md'
```
