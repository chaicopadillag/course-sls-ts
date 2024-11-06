import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import normalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import { Handler } from 'aws-lambda';


export const appMiddleware = (handler: Handler) => middy(handler).use(jsonBodyParser()).use(normalizer()).use(httpErrorHandler());