[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub file size in bytes](https://img.shields.io/github/size/jankapunkt/meteor-template-monitor/template-monitor.js)
![GitHub](https://img.shields.io/github/license/jankapunkt/meteor-template-monitor)


# Meteor Template Monitor

Monitoring for Blaze templates. Tracks the following `Template` internals:

- `Template.prototype.onCreated`
- `Template.prototype.onRendered`
- `Template.prototype.onDestroyed`
- `Template.prototype.helpers`
- `Template.prototype.events`
- `Template.prototype.constructView`
- `Template.registerHelper`

Currently measures

- Call count per Template and per function
- Duration of call and average duration of the last 100 calls

## Installation and usage

Use

```bash
$ meteor add jkuester:template-monitor
```

to install the package.

### Covering Templates from other packages

The package hooks immediately into `Template` as soon as it's added. Therefore you have to place the package in your 
`.meteor/packages` at a position, where all following packages are intended to be monitored.

This is due to the fact, that many packages still use `api.addFiles` in order to register Templates immediately at
build / startup time. If they are added before the this one they simply wont't be monitored.

If you only want to monitor your project's Templates you place the package as the last entry in `.meteor/packages`.

### Configuration

This package monitors all the aforementioned Template internals by default. If you want to shut anyone off you can
add the following entry to your **`Meteor.settings.public`**:

```json
{
  "templateMonitor": {
    "onCreated": Boolean,
    "onRendered": Boolean,
    "onDestroyed": Boolean,
    "helpers": Boolean,
    "events": Boolean,
    "constructView": Boolean,
    "registerHelper": Boolean
  }
}
```

Omitting an entry or setting it to `true` have basically the same effect, only an explicit `false` will skip monitoring
the respective internals.

### Accessing the stats

You can manually access the stats at any point using `Template.monitor()`, which will return an Object with a snapshot
of all current stats.

You can either call it from your code or even type it in the Browser's JavaScript console.

**Note for Firefox users**: Firefox prevents timing attacks by [rounding values of `performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
which may result in less distinctive stats. If you need detailed insights to timing you may check for a browser, that
does not use this rounding or disable it in Firefox.

## License

MIT, see [LICENSE](./LICENSE)
