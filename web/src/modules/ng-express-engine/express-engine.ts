import * as fs from 'fs';
import { Request, Response, Send } from 'express';
import { Provider, NgModuleFactory, NgModuleRef, PlatformRef, ApplicationRef, Type, Compiler, CompilerFactory } from '@angular/core';
import { platformServer, platformDynamicServer, PlatformState, INITIAL_CONFIG, renderModuleFactory } from '@angular/platform-server';
import {ResourceLoader} from '@angular/compiler'
import { FileLoader } from './file-loader';
import { REQUEST, RESPONSE } from './tokens';

/**
 * These are the allowed options for the engine
 */
export interface NgSetupOptions {
  aot?: boolean;
  bootstrap: Type<{}> | NgModuleFactory<{}>;
  providers?: Provider[];
}

/**
 * These are the allowed options for the render
 */
export interface RenderOptions extends NgSetupOptions {
  req: Request;
  res?: Response;
}

/**
 * This holds a cached version of each index used.
 */
const templateCache: { [key: string]: string } = {};

/**
 * Map of Module Factories
 */
const factoryCacheMap = new Map<Type<{}>, NgModuleFactory<{}>>();

export function ngExpressEngine(setup_options: NgSetupOptions) {

  const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);
  const compiler: Compiler = compilerFactory.createCompiler([
    {
      providers: [
        { provide: ResourceLoader, useClass: FileLoader }
      ]
    }
  ]);

  return function (filePath: string, options: RenderOptions, callback: (err?: Error | null, html?: string) => void) {

    options.providers = options.providers || [];

    try {
      // const moduleOrFactory = options.bootstrap || setupOptions.bootstrap;
      //
      // if (!moduleOrFactory) {
      //   throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
      // }

      let module_factory: Type<{}> | NgModuleFactory<{}> = setup_options.bootstrap;

      if (!module_factory) {
        throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
      }

      setup_options.providers = setup_options.providers || [];

      const extraProviders = setup_options.providers.concat(
          options.providers,
          getReqResProviders(options.req, options.res),
          [
            {
              provide: INITIAL_CONFIG,
              useValue: {
                document: getDocument(filePath),
                url: options.req.originalUrl
              }
            }
          ]);

      getFactory(module_factory, compiler)
          .then(factory => {
            return renderModuleFactory(factory, {
              extraProviders: extraProviders
            });
          })
          .then((html: string) => {
            callback(null, html);
          }, (err) => {
            callback(err);
          });
    } catch (err) {
      callback(err);
    }
  };
}

/**
 * Get a factory from a bootstrapped module/ module factory
 */
function getFactory(
    moduleOrFactory: Type<{}> | NgModuleFactory<{}>, compiler: Compiler
): Promise<NgModuleFactory<{}>> {
  return new Promise<NgModuleFactory<{}>>((resolve, reject) => {
    // If module has been compiled AoT
    if (moduleOrFactory instanceof NgModuleFactory) {
      resolve(moduleOrFactory);
      return;
    } else {
      let moduleFactory = factoryCacheMap.get(moduleOrFactory);

      // If module factory is cached
      if (moduleFactory) {
        resolve(moduleFactory);
        return;
      }

      // Compile the module and cache it
      compiler.compileModuleAsync(moduleOrFactory)
          .then((factory) => {
            factoryCacheMap.set(moduleOrFactory, factory);
            resolve(factory);
          }, (err => {
            reject(err);
          }));
    }
  });
}

function getReqResProviders(req: Request, res: Response): Provider[] {
  const providers: Provider[] = [
    {
      provide: 'REQUEST',
      useValue: req
    }
  ];
  if (res) {
    providers.push({
      provide: 'RESPONSE',
      useValue: res
    });
  }
  return providers;
}

/**
 * Get the document at the file path
 */
function getDocument(filePath: string): string {
  return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
}

/**
 * Handle the request with a given NgModuleRef
 */
function handleModuleRef(moduleRef: NgModuleRef<{}>, callback: Send) {
  const state = moduleRef.injector.get(PlatformState);
  const appRef = moduleRef.injector.get(ApplicationRef);

  appRef.isStable
    .filter((isStable: boolean) => isStable)
    .first()
    .subscribe((stable) => {
      const bootstrap = moduleRef.instance['ngOnBootstrap'];
      bootstrap && bootstrap();

      callback(state.renderToString());
      moduleRef.destroy();
    });
}
