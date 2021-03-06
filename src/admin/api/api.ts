'use strict';

import { Path, GET, POST, DELETE, PUT, PathParam, QueryParam, Return } from 'typescript-rest';
import { ApiConfig, validateApiConfig } from '../../config/api';
import { ApiService } from '../../service/api';
import { Inject } from 'typescript-ioc';
import * as swagger from 'typescript-rest-swagger';
import { Configuration } from '../../configuration';

@Path('apis')
@swagger.Tags('APIs')
@swagger.Security('Bearer')
export class APIRest {
    @Inject private service: ApiService;
    @Inject private config: Configuration;

    @GET
    list( @QueryParam('name') name?: string,
        @QueryParam('version') version?: string,
        @QueryParam('description') description?: string,
        @QueryParam('path') path?: string): Promise<Array<ApiConfig>> {
        return this.service.list(name, version, description, path);
    }

    @POST
    addApi(api: ApiConfig): Promise<Return.NewResource<void>> {
        return new Promise<Return.NewResource<void>>((resolve, reject) => {
            validateApiConfig(api, this.config.gateway.disableApiIdValidation)
                .then(() => this.service.create(api))
                .then((apiId) => resolve(new Return.NewResource<void>(`apis/${apiId}`)))
                .catch(reject);
        });
    }

    @PUT
    @Path('/:id')
    updateApi( @PathParam('id') id: string, api: ApiConfig): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            api.id = id;

            validateApiConfig(api, this.config.gateway.disableApiIdValidation)
                .then(() => this.service.update(api))
                .then(() => resolve())
                .catch(reject);
        });
    }

    @DELETE
    @Path('/:id')
    removeApi( @PathParam('id') id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.service.remove(id)
                .then(() => resolve())
                .catch(reject);
        });
    }

    @GET
    @Path('/:id')
    getApi( @PathParam('id') id: string): Promise<ApiConfig> {
        return new Promise((resolve, reject) => {
            this.service.get(id)
                .then(resolve)
                .catch(reject);
        });
    }
}
