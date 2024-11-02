let production = undefined;

switch(process.env.NODE_ENV) {
    case 'production':
      production = true;
      break;
    case 'development':
    default:
      production = false;
}

export const environment = {

    production: production,
    serverUrl: `${production ? 'https://tbd:9000/api' : 'http://localhost:9000/api'}`,
    socketManagerUrl: `${production ? 'tbd:9000' : 'localhost:9000'}`,
    cosineSocketUrl:`${production ? 'tbd:9000' : 'localhost:9000'}`,
    lineSocketUrl:`${production ? 'tbd:8999' : 'localhost:8999'}`,
    tsneSocketUrl:`${production ? 'tbd:9001' : 'localhost:9001'}`,
};