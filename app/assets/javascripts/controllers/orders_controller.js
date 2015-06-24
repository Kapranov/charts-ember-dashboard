ChartsEmberDashboard.OrdersController = Ember.ArrayController.extend({
  totalQuantity: (function() {
    return this.reduce((function(previousValue, order) {
      return previousValue + order.quantity;
    }), 0);
  }).property('@each'),

  totalRevenue: (function() {
    return this.reduce((function(previousValue, order) {
      return previousValue + parseFloat(order.revenue);
    }), 0);
  }).property('@each'),

  chartSeries: (function() {
    var quantities, revenues;
    revenues = this.map(function(order) {
      return parseFloat(order.revenue);
    });
    quantities = this.mapBy('quantity');
    return [
      {
        name: 'Quantity',
        data: quantities
      }, {
        name: 'Revenue',
        data: revenues
      }
    ];
  }).property('@each')
});
