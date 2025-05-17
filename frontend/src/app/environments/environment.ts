

export const environment = {
  production: false,
  ivc: {
    protocol: 'http://',
    server: 'localhost',
    port : '4001',
    defaultVersion: '1',
  },
  external: {
    datosgov: {
      url: 'https://www.datos.gov.co/api/id/c36g-9fc2.json?$query=select%20*%2C%20%3Aid%20limit%20100'
    }
  },
};
