linter-ruby
=========================

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to Ruby's builtin syntax analysis. It will be used with files that have the `Ruby` syntax.

## Installation
On first activation the plugin will install all dependencies automatically, you no longer have to worry about installing Linter.

Just install this package and you'll be good to go.

## Settings
You can configure linter-ruby by editing ~/.atom/config.cson (choose Open Your Config in Atom menu):
```coffee
'linter-ruby':
  # ruby path. run `which ruby` to find the path.
  'rubyExecutablePath': null

  # ignored extensions, ERB and markdown files by default.
  'ignoredExtensions': 'erb, md'
```

## Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. welcome to the club

Please note that modifications should follow these coding guidelines:

- Indent is 2 spaces.
- Code should pass coffeelint linter.
- Vertical whitespace helps readability, don’t be afraid to use it.

Thank you for helping out!

## Donation
[![Share the love!](https://chewbacco-stuff.s3.amazonaws.com/donate.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8)
