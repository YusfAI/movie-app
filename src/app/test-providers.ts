import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/** Providers shared by component tests: router + mocked HTTP (no real TMDB calls). */
export const testProviders = [
  provideRouter(routes),
  provideHttpClient(),
  provideHttpClientTesting(),
];
