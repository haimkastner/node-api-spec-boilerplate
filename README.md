
# Node.JS API Spec Boilerplate

[![node-api-spec-boilerplate](https://github.com/haimkastner/node-api-spec-boilerplate/actions/workflows/actions.yml/badge.svg?branch=main)](https://github.com/haimkastner/node-api-spec-boilerplate/actions/workflows/actions.yml)


Build API server fast and get API spec, documentation and consumer facade for free

---

📙 For all info of how to create and build it, see [Perfect API Server](https://blog.castnet.club/en/blog/perfect-api-server-part-a) article in [my blog](https://blog.castnet.club/en) 📙

---
`Goal`

This boilerplate project used to be a start to API server that includes one-time deceleration of API controller, and from it generate all other required API components, instead of massive code and types duplication for each components.


---
`Includes`

This project used to be a boilerplate for building an API server with the following parts:
* Implementation Rest API controllers using [TSOA](https://tsoa-community.github.io/docs/)
* Build app, generate and publish OpenAPI spec using [GitHub Actions](https://github.com/haimkastner/node-api-spec-boilerplate/actions) CI/CD pipes
* Host OpenAPI documentation on [SwaggerHub](https://app.swaggerhub.com/apis/haimkastner/node-api-spec-boilerplate)
* Host [API Server](https://node-api-spec-boilerplate.castnet.club/) instance
* Build OpenAPI based TypeScript SDK [open-api-based-sdk-boilerplate](https://github.com/haimkastner/open-api-based-sdk-boilerplate)
* Hosting example SDK front UI on [NPM regitery](https://www.npmjs.com/package/@haimkastner/open-api-based-sdk-boilerplate)
* Build Frontend API Facade for TypeScript based projects [react-typescript-spec-facade](https://github.com/haimkastner/react-typescript-spec-facade) 
* Hosting example app front UI on [Netlify](https://react-typescript-spec-facade.castnet.club/)

---
`Config` 

All config by env vars, see for all options in [./env.example](./.env.example):
* `PORT`: The API Server port, as default it's `8080`  

---

### `Pase 2 - Long processing via Rest API` 


Adding jobs infrastructure required the following implementation:  
* A new [jobs service](https://github.com/haimkastner/node-api-spec-boilerplate/blob/with-jobs/src/services/jobs.service.ts) & [API](https://github.com/haimkastner/node-api-spec-boilerplate/blob/with-jobs/src/controllers/jobs.controller.ts).
* TSOA [template](https://github.com/haimkastner/node-api-spec-boilerplate/blob/with-jobs/src/infrastructure/routes.template.hbs) to inject job execution for operation.
* A [middleware](https://github.com/haimkastner/node-api-spec-boilerplate/blob/with-jobs/src/infrastructure/jobify.middleware.ts) for handling request to execute as jobs.


For all info of how to implement the job infrastructure, see [Long processing via Rest API](https://blog.castnet.club/en/blog/perfect-api-server-part-c-jobs) article in [my blog](https://blog.castnet.club/en) 📑
