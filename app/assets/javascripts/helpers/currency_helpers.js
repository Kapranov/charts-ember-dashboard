Ember.Handlebars.registerBoundHelper('numberToCurrency', function(number) {
  return accounting.formatMoney(number);
});
