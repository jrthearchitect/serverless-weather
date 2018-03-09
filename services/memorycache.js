var data = {};

exports.saveInput = function(db,zipData, clientId, errCallback, okCallback) {
  if (data[clientId] === undefined){
    data[clientId] = [];
  }
  data[clientId].push(zipData);
  okCallback(data[clientId]);
};

exports.getInputHistory = function(db,clientId) {
  console.log("ClientId = "+clientId);
  console.log('Cache Data is '+JSON.stringify(data));
  if (data[clientId] === undefined){
    data[clientId] = [];
  }
  return data[clientId];
};
