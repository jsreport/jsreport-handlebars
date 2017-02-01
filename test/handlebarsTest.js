var should = require('should')
var handlebars = require('../lib/handlebarsEngine.js')

describe('handlebars', function () {
  it('should render html', function () {
    var html = handlebars('Hey')(null, null)
    html.should.be.eql('Hey')
  })

  it('should be able to use helpers', function () {
    var html = handlebars('{{{a}}}')({ a: function () { return 'Hey' } }, null)
    html.should.be.eql('Hey')
  })

  it('should be able to use data', function () {
    var html = handlebars('{{{a}}}')(null, { a: 'Hey' })
    html.should.be.eql('Hey')
  })

  it('should throw when syntax error', function () {
    should(function () {
      handlebars('{{#if}}')(null, {})
    }).throw()
  })

  it('should work with jsreport syntax', function () {
    var html = handlebars('{#image {{b}}}')(null, { b: 'foo' })
    html.should.be.eql('{#image foo}')
  })

  it('should work with jsreport syntax in many places', function () {
    var html = handlebars("<img src='{#image {{name}}}'/><img src='{#image {{name2}}}'/>")(null, { name: 'foo', name2: 'bar' })
    html.should.be.eql("<img src='{#image foo}'/><img src='{#image bar}'/>")
  })
})

describe('handlebars full', function () {
  var jsreport = require('jsreport-core')()

  beforeEach(function () {
    return jsreport.use(require('../')()).init()
  })

  it('should expose handlebars global object', function () {
    return jsreport.render({
      template: {
        content: '{{foo}}',
        engine: 'handlebars',
        recipe: 'html',
        helpers: "function foo() { return handlebars.escapeExpression('a') }"
      }
    }).then(function (res) {
      res.content.toString().should.be.eql('a')
    })
  })

  it('should expose Handlebars global object', function () {
    return jsreport.render({
      template: {
        content: '{{foo}}',
        engine: 'handlebars',
        recipe: 'html',
        helpers: "function foo() { return Handlebars.escapeExpression('a') }"
      }
    }).then(function (res) {
      res.content.toString().should.be.eql('a')
    })
  })
})
