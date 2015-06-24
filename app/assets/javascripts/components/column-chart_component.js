ChartsEmberDashboard.ColumnChartComponent = Ember.Component.extend({
  tagName: 'div',
  classNames: ['highcharts'],
  contentChanged: (function() {
    return this.rerender();
  }).observes('series'),
  didInsertElement: function() {
    return $("#" + this.chartId).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Revenue by Product'
      },
      legend: {
        enabled: false
      },
      xAxis: {
        title: {
          text: 'Product Number'
        }
      },
      series: [
        {
          name: 'Quantity',
          data: [4, 4]
        }, {
          name: 'Revenue',
          data: [10.0, 10.0]
        }
      ]
    });
  },
  willDestroyElement: function() {
    return $("#" + this.chartId).highcharts().destroy();
  }
});
