Template.configureLoginServiceDialogForDropbox.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForDropbox.fields = function () {
  return [
    {property: 'clientId',  label: 'App ID'},
    {property: 'secret', label: 'Secret'}
  ];
};
