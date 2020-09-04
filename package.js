/* eslint-env meteor */
Package.describe({
  name: 'jkuester:template-monitor',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'Monitoring for Blaze templates',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:jankapunkt/meteor-template-monitor.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.6')
  api.use([
    'ecmascript',
    'templating@1.3.2'
  ], 'client')
  api.addFiles('template-monitor.js', 'client')
})
