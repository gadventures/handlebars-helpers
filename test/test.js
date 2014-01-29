/*global describe, it*/
var assert = require('assert'),
    helpers = require('../handlebars-helpers');

describe("Handlebars Helpers", function() {
    it("should export helpers", function() {
        assert.ok(helpers);
    });

    it("should humanize dates", function() {
        assert.equal(helpers.humanize("2012-01-01", "date"),
            "January 1st 2012");
        assert.equal(helpers.humanize("2012-01-01 23:15:45", "datetime"),
            "January 1st 2012, 11:15:45 pm");
    });

    it("should join an array of strings", function() {
        assert.equal(helpers.join(['foo', 'bar']), 'foo, bar');
        assert.equal(helpers.join([
            {'foo': 'First'},
            {'foo': 'Second'}
        ], 'foo'), 'First, Second');
    });

    it("should pluralize if n > 1 array", function() {
        assert.equal(helpers.pluralize(['foo', 'bar'], 'item', 'items'), 'items');
        assert.equal(helpers.pluralize(['foo'], 'item', 'items'), 'item');
    });
});
