/*!
 * Copyright(c) 2018 Jan Blaha
 */

const path = require('path')
const hbPath = path.join(path.dirname(require.resolve('handlebars')), '../')

module.exports = function (reporter, definition) {
  if (reporter.compilation) {
    reporter.compilation.include('handlebarsModule', hbPath)
  }

  reporter.options.templatingEngines.nativeModules.push({
    globalVariableName: 'handlebars',
    module: reporter.execution ? reporter.execution.resolve('handlebarsModule') : hbPath
  })

  // alias Handlebars=handlebars
  reporter.options.templatingEngines.nativeModules.push({
    globalVariableName: 'Handlebars',
    module: reporter.execution ? reporter.execution.resolve('handlebarsModule') : hbPath
  })

  reporter.extensionsManager.engines.push({
    name: 'handlebars',
    pathToEngine: path.join(__dirname, 'handlebarsEngine.js')
  })

  // we need to addFileExtensionResolver after the store provider extension is initialized, but before
  // every other extension like sample template is processed
  reporter.initializeListeners.insert(0, 'handlebars', () => {
    reporter.documentStore.addFileExtensionResolver((doc, entitySetName, entityType, propertyType) => {
      if (doc.engine === 'handlebars' && propertyType.document.engine) {
        return 'handlebars'
      }
    })
  })
}
