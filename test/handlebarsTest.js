const should = require('should')
const handlebars = require('../lib/handlebarsEngine.js')

describe('handlebars', () => {
  it('should render html', function () {
    handlebars('Hey')(null, null).should.be.eql('Hey')
  })

  it('should be able to use helpers', () => {
    const html = handlebars('{{{a}}}')({ a: function () { return 'Hey' } }, null)
    html.should.be.eql('Hey')
  })

  it('should be able to use data', () => {
    const html = handlebars('{{{a}}}')(null, { a: 'Hey' })
    html.should.be.eql('Hey')
  })

  it('should throw when syntax error', () => {
    should(() => {
      handlebars('{{#if}}')(null, {})
    }).throw()
  })

  it('should work with jsreport syntax', () => {
    const html = handlebars('{#image {{b}}}')(null, { b: 'foo' })
    html.should.be.eql('{#image foo}')
  })

  it('should work with jsreport syntax in many places', () => {
    const html = handlebars(
      "{{name2}} {#child @data.foo={{aHelper}}}<img src='{#image {{name2}}}'/>"
    )({ aHelper: () => { return 'a' } }, { name2: 'bar' })

    html.should.be.eql("bar {#child @data.foo=a}<img src='{#image bar}'/>")
  })
})

describe('handlebars full', () => {
  let jsreport
  beforeEach(() => {
    jsreport = require('jsreport-core')()
    jsreport.use(require('../')())
    return jsreport.init()
  })

  it('should expose handlebars global object', async () => {
    const res = await await jsreport.render({
      template: {
        content: '{{foo}}',
        engine: 'handlebars',
        recipe: 'html',
        helpers: "function foo() { return handlebars.escapeExpression('a') }"
      }
    })

    res.content.toString().should.be.eql('a')
  })

  it('should expose Handlebars global object', async () => {
    const res = await jsreport.render({
      template: {
        content: '{{foo}}',
        engine: 'handlebars',
        recipe: 'html',
        helpers: "function foo() { return Handlebars.escapeExpression('a') }"
      }
    })
    res.content.toString().should.be.eql('a')
  })
})
