/*!
 * Copyright(c) 2018 Jan Blaha
 */

const path = require('path')

module.exports = function (reporter, definition) {
  const hbRawPath = definition.options.handlebarsModulePath != null ? definition.options.handlebarsModulePath : require.resolve('handlebars')
  const hbPath = path.join(path.dirname(hbRawPath), '../')

  reporter.options.templatingEngines.nativeModules.push({
    globalVariableName: 'handlebars',
    module: hbPath
  })

  // alias Handlebars=handlebars
  reporter.options.templatingEngines.nativeModules.push({
    globalVariableName: 'Handlebars',
    module: hbPath
  })

  reporter.extensionsManager.engines.push({
    name: 'handlebars',
    pathToEngine: path.join(__dirname, 'handlebarsEngine.js'),
    engineOptions: {
      handlebarsModulePath: hbPath
    }
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
