/* global describe, it, require */
var assert = require('assert'),
    Handlebars = require('handlebars');

// Update Handlebars with new helpers.
Handlebars = require('../handlebars-helpers');

var helpers = Handlebars.helpers;

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

    it("should pluck nested objects using dot notation", function() {
        assert.equal(helpers.join([
            {'name': {'first': 'Bob'}},
            {'name': {'first': 'Joe'}}
        ], 'name.first'), 'Bob, Joe');
    });

    it("should pluralize if n > 1 array", function() {
        assert.equal(helpers.pluralize(['foo', 'bar'], 'item', 'items'), 'items');
        assert.equal(helpers.pluralize(['foo'], 'item', 'items'), 'item');
    });

    it("dateRange should return a date range only if dates don't match", function() {
        assert.equal(helpers.dateRange("2014-02-07", "2014-02-17"), "2014-02-07 to 2014-02-17");
        assert.equal(helpers.dateRange("2014-02-07", "2014-02-17", " - "), "2014-02-07 - 2014-02-17");
        assert.equal(helpers.dateRange("2014-02-07", "2014-02-07"), "2014-02-07");
    });

    it("prettyDateRange should pretty print a date range", function() {
        assert.equal(helpers.prettyDateRange("2014-02-07", "2014-02-17", " to ", "date"),
            "February 7th 2014 to February 17th 2014");
        assert.equal(helpers.prettyDateRange("2014-02-07", "2014-02-17", " to "),
            "February 7th 2014 to February 17th 2014");
        assert.equal(helpers.prettyDateRange("2014-02-07", "2014-02-17"),
            "February 7th 2014 to February 17th 2014");
    });

    it("should slugify strings", function() {
        assert.equal(helpers.slugify("A String"), "a-string");
        assert.equal(helpers.slugify(""), "");
        assert.equal(helpers.slugify("funk !#@!#"), "funk-");
        assert.equal(helpers.slugify("#@!*&^%#123"), "123");
    });

    it("should provide default string if variable is falsy", function() {
        assert.equal(helpers.withDefault("A string", "default"), "A string");
        assert.equal(helpers.withDefault("", "default"), "default");
        assert.equal(helpers.withDefault(null, "default"), "default");

        assert.equal(helpers.withDefault("A string"), "A string");
        assert.equal(helpers.withDefault(""), "<em>(empty)</em>");
        assert.equal(helpers.withDefault(null), "<em>(empty)</em>");
    });

    it("should wrap paragraphs in HTML 'p' tags, and replace single newlines with 'br' tags", function() {
        assert.equal(helpers.linebreaks("A string"), "<p>A string</p>");
        assert.equal(helpers.linebreaks("A\nstring"), "<p>A<br />string</p>");
        assert.equal(helpers.linebreaks("A\n\nstring"), "<p>A</p>\n\n<p>string</p>");
        assert.equal(helpers.linebreaks("A\n\n\nstring"), "<p>A</p>\n\n<p>string</p>");
        assert.equal(helpers.linebreaks("A\n\nbig\nstring"), "<p>A</p>\n\n<p>big<br />string</p>");
        assert.equal(helpers.linebreaks("A\n\nstring\n\n"), "<p>A</p>\n\n<p>string</p>");
        assert.equal(helpers.linebreaks("A string\n"), "<p>A string<br /></p>");

        assert.equal(helpers.linebreaks("A\r\nstring"), "<p>A<br />string</p>");
        assert.equal(helpers.linebreaks("A\r\n\r\nstring"), "<p>A</p>\n\n<p>string</p>");
        assert.equal(helpers.linebreaks("A\r\n\r\n\r\nstring"), "<p>A</p>\n\n<p>string</p>");
        assert.equal(helpers.linebreaks("A\r\n\r\nbig\r\nstring"), "<p>A</p>\n\n<p>big<br />string</p>");
        assert.equal(helpers.linebreaks("A\r\n\r\nstring\r\n\r\n"), "<p>A</p>\n\n<p>string</p>");
        assert.equal(helpers.linebreaks("A string\r\n"), "<p>A string<br /></p>");

        assert.equal(helpers.linebreaks("A\r\n\nstring"), "<p>A</p>\n\n<p>string</p>");
        assert.equal(helpers.linebreaks("A\n\r\nstring"), "<p>A</p>\n\n<p>string</p>");

        assert.equal(helpers.linebreaks(""), "");
        assert.equal(helpers.linebreaks(undefined), undefined);
        assert.equal(helpers.linebreaks(null), null);
    });
});
