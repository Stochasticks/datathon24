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
    serverUrl: `${production ? 'https://tbd:9000/api' : 'http://127.0.0.1:9999/api'}`,
    balanceSheetUrl: `${production ? 'https://614ixqofuc.execute-api.us-west-2.amazonaws.com/default' : 'http://127.0.0.1:9999/api'}`,
    incomeStatementUrl: `${production ? 'https://614ixqofuc.execute-api.us-west-2.amazonaws.com/default' : 'http://127.0.0.1:9999/api'}`,
    cashFlowUrl: `${production ? 'https://614ixqofuc.execute-api.us-west-2.amazonaws.com/default' : 'http://127.0.0.1:9999/api'}`,
    ratiosUrl: `${production ? 'https://614ixqofuc.execute-api.us-west-2.amazonaws.com/default' : 'http://127.0.0.1:9999/api'}`,
    sentimentUrl: `${production ? 'https://u2et6buhf3.execute-api.us-west-2.amazonaws.com' : 'https://u2et6buhf3.execute-api.us-west-2.amazonaws.com'}`,
    sectorComparisonUrl: `${production ? 'https://u2et6buhf3.execute-api.us-west-2.amazonaws.com' : 'http://127.0.0.1:9999/api'}`,
    chatURL: `${production ? 'https://7wvo8rflv2.execute-api.us-west-2.amazonaws.com/api' : 'http://localhost:8000/api'}`,
    socketManagerUrl: `${production ? 'tbd:9000' : 'localhost:9000'}`,
    cosineSocketUrl:`${production ? 'tbd:9000' : 'localhost:9000'}`,
    lineSocketUrl:`${production ? 'tbd:8999' : 'localhost:8999'}`,
    tsneSocketUrl:`${production ? 'tbd:9001' : 'localhost:9001'}`,
};