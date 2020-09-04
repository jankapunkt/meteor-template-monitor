// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by template-monitor.js.
import { name as packageName } from "meteor/jkuester:template-monitor";

// Write your tests here!
// Here is an example.
Tinytest.add('template-monitor - example', function (test) {
  test.equal(packageName, "template-monitor");
});
