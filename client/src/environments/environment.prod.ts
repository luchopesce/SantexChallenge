export const environment = {
  production: true,
  serverUrl: 'http://localhost:3000',
  apiName: 'api',
  get apiUrl() {
    return `${this.serverUrl}/${this.apiName}`;
  },
};
