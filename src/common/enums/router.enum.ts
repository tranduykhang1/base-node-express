export enum ROUTER_TYPE {
  AUTH = 'AUTH', // token-based auth, no csrf
  NO_CSRF = 'API', // token/session auth, no csrf
  WITH_CSRF = 'CSRF' // token/session auth, with csrf
}
