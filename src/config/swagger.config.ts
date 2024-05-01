import { Application } from 'express'
import * as expressJSDocSwagger from 'express-jsdoc-swagger'

// https://brikev.github.io/express-jsdoc-swagger-docs/#/
const options = {
  info: {
    version: '1.0.0',
    title: 'DEMO',
    license: {
      name: 'MIT'
    }
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic'
    }
  },
  baseDir: __dirname,
  filesPattern: '../app/router/*.ts',
  swaggerUIPath: '/docs',
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: '/v3/api-docs',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true
}

export default (app: Application) => {
  expressJSDocSwagger.default(app)(options)
}
