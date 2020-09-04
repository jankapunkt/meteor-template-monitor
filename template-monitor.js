/* global performance */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

const settings = Object.assign({}, Meteor.settings && Meteor.settings.public && Meteor.settings.public.templateMonitor)
const originals = {}
const internals = {}

/**
 * Returns the current Template monitoring state.
 * @return {{} & {constructView: {}, onCreated: {}, onRendered: {}, onDestroyed: {}, helpers: {}, events: {}, registerHelper:{}}
 */
Template.monitor = function () {
  return Object.assign({}, internals)
}

function registerHelper () {
  internals.registerHelper = internals.registerHelper || {}
  originals.registerHelper = Template.registerHelper

  Template.registerHelper = function (name, fct) {
    internals.registerHelper[name] = internals.registerHelper[name] || { count: 0 }

    const wrapper = function (...args) {
      const start = performance.now()
      const result = fct.apply(this, args)
      const end = performance.now()
      internals.registerHelper[name].count++
      measureTime(start, end, internals.registerHelper[name])
      return result
    }
    originals.registerHelper(name, wrapper)
  }
}

function templateHooks (name) {
  internals[name] = internals[name] || {}
  originals[name] = Template.prototype[name]

  Template.prototype[name] = function (cb) {
    const instance = this
    const { viewName } = instance
    internals[name][viewName] = internals[name][viewName] || { count: 0, time: {} }

    const wrapper = function (...args) {
      const start = performance.now()
      const result = cb.apply(this, args)
      const end = performance.now()
      internals[name][viewName].count++
      measureTime(start, end, internals[name][viewName])
      return result
    }

    originals[name].call(instance, wrapper)
  }
}

function constructView () {
  internals.constructView = internals.constructView || {}
  originals.constructView = Template.prototype.constructView

  Template.prototype.constructView = function (...args) {
    const instance = this
    const { viewName } = instance
    internals.constructView[viewName] = internals.constructView[viewName] || { count: 0, time: {} }

    const start = performance.now()
    const result = originals.constructView.apply(instance, args)
    const end = performance.now()

    internals.constructView[viewName].count++
    measureTime(start, end, internals.constructView[viewName].time)
    return result
  }
}

function templateMaps (name) {
  internals[name] = internals[name] || {}
  originals[name] = Template.prototype[name]

  Template.prototype[name] = function (dict) {
    const instance = this
    const { viewName } = instance
    internals[name][viewName] = internals[name][viewName] || {}

    Object.entries(dict).forEach(([key, fct]) => {
      internals[name][viewName][key] = internals[name][viewName][key] || { count: 0, time: {} }
      dict[key] = function (...args) {
        const start = performance.now()
        const result = fct.apply(this, args)
        const end = performance.now()
        internals[name][viewName][key].count++
        measureTime(start, end, internals[name][viewName][key].time)
        return result
      }
    })

    originals[name].call(instance, dict)
  }
}

const measureTime = (start, end, time) => {
  const diff = end - start
  if (!time.min || time.min > diff) {
    time.min = diff
  }
  if (!time.max || time.max < diff) {
    time.max = diff
  }

  if (!time.list) {
    time.list = []
  }

  if (time.list.length === 100) {
    time.list = time.list.slice(50, 99)
  }

  time.list.push(diff)

  time.avg = time.list.reduce((a, b) => a + b) / time.list.length
}

if (settings.constructView !== false) constructView()
if (settings.registerHelper !== false) registerHelper()
if (settings.onCreated !== false) templateHooks('onCreated')
if (settings.onRendered !== false) templateHooks('onRendered')
if (settings.onDestroyed !== false) templateHooks('onDestroyed')
if (settings.helpers !== false) templateMaps('helpers')
if (settings.events !== false) templateMaps('events')
