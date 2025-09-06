import { authGuard } from './auth-guard';
import { Route, UrlSegment } from '@angular/router';

describe('authGuard (CanMatch)', () => {
  it('should return true', () => {
    const route = {} as Route;
    const segments = [] as UrlSegment[];
    expect(authGuard(route, segments)).toBeTrue();
  });
});
