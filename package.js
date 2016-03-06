Package.describe({
    name: 'nitrolabs:dropbox-oauth',
    summary: "Login service for dropbox accounts",
    version: '1.3.0',
    git: 'https://github.com/NitroLabs/meteor-dropbox-oauth'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2');
    api.use('oauth', ['client', 'server']);
    api.use('oauth2', ['client', 'server']);
    api.use('http', ['client', 'server']);
    api.use('templating', 'client');
    api.use('service-configuration', ['client', 'server']);

    api.export('DropboxOAuth');

    api.addFiles('html/dropbox_configure.html', 'client');
    api.addFiles('lib/dropbox_configure.js', 'client');
    api.addFiles('lib/dropbox_server.js', 'server');
    api.addFiles('lib/dropbox_client.js', 'client');
});
