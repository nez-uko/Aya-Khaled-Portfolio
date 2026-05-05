import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginpageGuard } from './loginpage-guard';

describe('loginpageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginpageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
