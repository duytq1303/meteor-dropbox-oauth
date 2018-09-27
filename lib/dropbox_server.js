DropboxOAuth = {};

OAuth.registerService('dropbox', 2, null, function(query) {
    var response = getTokens(query);
    var accessToken = response.accessToken;
    var uid = response.uid;
    var identity = getIdentity(accessToken);
    var serviceData = {
        id: uid,
        accessToken: accessToken,
        display_name: identity.name.display_name // Backward compatibility with Dropbox API v1
    };
    // include all fields from dropbox
    // https://www.dropbox.com/developers/documentation/http/documentation#users-get_current_account
    var fields = _.omit(identity, ['account_type']);
    var fields = _.omit(fields, ['root_info']);
     // Remove "account_type" because it contains a ".tag" field not valid for mongo storage
    _.extend(serviceData, fields);


    return {
        serviceData: serviceData,
        options: {
            profile: { name: serviceData.display_name, avatar: identity.profile_photo_url }
        }
    };
});

// returns an object containing:
// - accessToken
// - tokenType
// - uid
var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'dropbox'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    var redirectUri = OAuth._redirectUri('dropbox', config, {}, {secure: true}).replace('?close', '?close=true');
    console.log(redirectUri);
    response = HTTP.post(
      "https://api.dropbox.com/1/oauth2/token", {params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }});
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Dropbox. " + err.message),
                   {response: err.response});
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Dropbox. " + response.data.error);
  } else {
    return {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type,
      uid: response.data.uid
    };
  }
};

var getIdentity = function (accessToken) {
  try {
    return Meteor.http.post("https://api.dropbox.com/2/users/get_current_account", {
        headers: { Authorization: 'Bearer ' + accessToken }
    }).data;
  } catch (err) {
    throw new Error("Failed to fetch identity from dropbox. " + err.message);
  }
};

DropboxOAuth.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
