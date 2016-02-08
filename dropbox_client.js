DropboxOAuth = {};

// Request dropbox credentials for the user
// @param options {optional}
// @param callback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
DropboxOAuth.requestCredential = function (options, callback) {
  // support both (options, callback) and (callback).
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'dropbox'});
  if (!config) {
    callback && callback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  var credentialToken = Random.secret();

  var loginStyle = OAuth._loginStyle('dropbox', config, options);

  var loginUrl =
        'https://www.dropbox.com/1/oauth2/authorize' +
        '?response_type=code' +
        '&client_id=' + config.clientId +
        '&redirect_uri=' + OAuth._redirectUri('dropbox', config, {}, {secure: true}) +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);
  loginUrl = loginUrl.replace('?close', '?close=true');

  OAuth.launchLogin({
    loginService: "dropbox",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: callback,
    credentialToken: credentialToken,
    popupOptions: { height: 600 }
  });
};
