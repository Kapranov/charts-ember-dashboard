README
------

Creating a metrics dashboard with Ember-js,
Twitter-Bootstrap and Rails.

![ember-dashboard-charts](/public/dashboard_screen_1.jpg)
![ember-dashboard-charts](/public/dashboard_screen_2.jpg)

#### Creating Dashboard with Ember.js, Twiter-Bootstrap, Rails.

bash> rails _4.2.2_ new dashboard --skip-test-unit --skip-active-record
        --skip-spring --skip-turbolinks

Then we want to add the route that will render our dashboard.
We will use the home controller and the index action:

bash> rails g controller Home index --no-assets --no-test-framework --no-helper

We wil route everything to Ember, so replace your config/routes.rb
file with the following:

##### config/routes.rb
Rails.application.routes.draw do
 root 'home#index'
end

If you start your server now with
bash> rails server and open up localhost:3000

We will be using stock Twitter Bootstrap for this project
so let’s add thebootstrap-sass gem to our Gemfile.

##### Front-end framework for developing responsive
gem 'bootstrap-sass'

And configure it by creating a bootstrap_config.css.scss file.

// app/assets/stylesheets/bootstrap_config.css.scss
@import "bootstrap";

Then we can change the home/index.html.erb view to the following:

<div class='container'>
 <div class='jumbotron'>
 <h1>Hello from Twitter Bootstrap!</h1>
 <p>Lots of predefined style that makes things easy to prototype!</p>
 </div>
</div>

And when you restart the server you should see result

We can now add the ember-rails and ember-source gems
for Ember assets and scaffolding to our Gemfile.

##### JS framework for creating ambitious web applications.
gem 'ember-rails'
gem 'ember-source'

And install the Ember assets with:
bash> rails generate ember:bootstrap

The application.js file should look like this:

//= require jquery
//= require_tree .

Next move the html from home/index.html.erb and replace it
with the following:

<% # Rendered Entirely in EmberJS. See app/assets/javascripts %>

Then we can move the html generation to ember by placing it
in the top level application.hbs handlebars file.

<!— app/assets/javascripts/templates/application.hbs -->
<div class='container'>
 <div class='jumbotron'>
 <h1>Hello from Ember.js!</h1>
 <p>The link to the home page is {{#link-to 'application'}}here{{/link-to}}</p>
 </div>
</div>

We’re going to add some tables and see how data flows through an Ember app.

Preparing the application

Before we add any more content let’s update our Ember application template and
add a basic structure with some navigation in app/assets/javascripts/templates/
application.hbs.

<div class='container'>

 <header class='masthead'>
   <nav class='navbar navbar-default' role='navigation'>
     <div class='container-fluid'>
       <div class='navbar-header'>
         <button type='button' class='navbar-toggle'
             data-toggle='collapse'
             data-target='#main-nav-collapse'>
           <span class='sr-only'>Toggle navigation</span>
           <span class='icon-bar'></span>
           <span class='icon-bar'></span>
           <span class='icon-bar'></span>
         </button>
         {{#link-to 'application' class='navbar-brand'}}Dashboard{{/link-to}}
       </div>

       <div class='collapse navbar-collapse' id='main-nav-collapse'>
         <ul class='nav navbar-nav'>
           {{#link-to 'index' tagName='li' activeClass='active'}}
             {{#link-to 'index'}}Home{{/link-to}}
          {{/link-to}}
        </ul>
      </div>
    </div>
   </nav>
 </header>

 <section class='main-content'>
   {{outlet}}
 </section>

</div>

And let’s add an index template so we know when we’re on the home page in app/
assets/javascripts/templates/index.hbs.

<div class='jumbotron'>
 <h1>Hello from Ember.js!</h1>
 <p>Let’s see some metrics.</p>
</div>

If you reload the page you should now see result:

Creating Tables with Ember and Handlebars

Often the simplest way to display metrics data is to just put it all in a table.
Let’s create this to display some financial data about our sales process.

Create the Ember route to get to this URL. Let’s edit app/assets
/javascripts/router.js and add it:

##### app/assets/javascripts/router.js
Dashboard.Router.map(function() {
  this.resource('orders');
});

Static HTML in app/assets/javascripts/templates/orders.hbs

<h1>Orders</h1>
<table class=’table table-striped’>
 <tr>
   <th>#</th>
   <th>First Name</th>
   <th>Last Name</th>
   <th>Quantity</th>
   <th>Revenue</th>
 </tr>
 <tr>
   <td>1</td>
   <td>James</td>
   <td>Deen</td>
   <td>1</td>
   <td>$10.00</td>
 </tr>
 <tr>
   <td>2</td>
   <td>Alex</td>
   <td>Baldwin</td>
   <td>2</td>
   <td>$20.00</td>
 </tr>
</table>

<p>Total Quantity: <b>3</b></p>
<p>Total Revenue: <b>$30</b></p>

Then we can add a link to this page in our application.hbs file
(the double link-to is an annoying hack but explained here):

<div class='collapse navbar-collapse' id='main-nav-collapse'>
 <ul class='nav navbar-nav'>
   {{#link-to 'index' tagName='li' activeClass='active'}}
     {{#link-to 'index'}}Home{{/link-to}}
   {{/link-to}}
   {{#link-to 'orders' tagName='li' activeClass='active'}}
     {{#link-to 'orders'}}Orders{{/link-to}}
   {{/link-to}}
 </ul>
</div>

Then if you reload and follow the orders nav link you should see result:

Next step to create dynamic tables:

In Ember, a template typically retrieves information to display from a
controller, and the controller is set up by its route. Let’s make this
table dynamic by assigning the data required to build it in the Orders
Route.

##### app/assets/javascripts/routes/orders_route.js
Dashboard.OrdersRoute = Ember.Route.extend({
  model: function() {
    return [
      {
        id: 1,
        firstName: 'James',
        lastName: 'Deen',
        quantity: 1,
        revenue: '10.00'
      },
      {
        id: 2,
        firstName: 'Alex',
        lastName: 'Baldwin',
        quantity: 2,
        revenue: '20.00'
      }
    ]
  }
});

And then we set up the controller to process the totals in the
OrdersController.

##### app/assets/javascripts/controllers/orders_controller.js
Dashboard.OrdersController = Ember.ArrayController.extend({
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

And this lets us use the data provided by the controller in the template:

<h1>Orders</h1>
<table class=’table table-striped’>
 <tr>
   <th>#</th>
   <th>First Name</th>
   <th>Last Name</th>
   <th>Quantity</th>
   <th>Revenue</th>
 </tr>
 {{#each}}
 <tr>
   <td>{{id}}</td>
   <td>{{firstName}}</td>
   <td>{{lastName}}</td>
   <td>{{quantity}}</td>
   <td>{{revenue}}</td>
   </tr>
 {{/each}}
</table>

<p>Total Quantity: <b>{{totalQuantity}}</b></p>
<p>Total Revenue: <b>{{totalRevenue}}</b></p>

If you reload the page it should now look result:

Dynamic Orders Screen:

Formatting Values With Helpers

There are a few good libraries for formatting currencies in JavaScript,
and Ember makes it simple to access these libraries in your handlebars
templates. Let’s add the accounting.js library to format our revenue
numbers.

First install the library to vendor/assets/javascripts:

bash> wget  https://raw.github.com/josscrowcroft/accounting.js/master/accounting.js
        -o vendor/assets/javascripts/accounting-0.3.2.js

Then include it in your application.js file:

//= require jquery
//= require accounting-0.3.2
//= require_tree .

Then create a currency_helpers.js file to wrap the library.

##### app/assets/javascripts/helpers/currency_helpers.js
Ember.Handlebars.registerBoundHelper('numberToCurrency',
  function(number) {
    return accounting.formatMoney(number);
});

And finally we can use this helper in our orders.hbs view:

<h1>Orders</h1>

<table class='table table-striped'>
  <tr>
    <th>#</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Quantity</th>
    <th>Revenue</th>
  </tr>
  {{#each}}
  <tr>
    <td>{{id}}</td>
    <td>{{firstName}}</td>
    <td>{{lastName}}</td>
    <td>{{quantity}}</td>
    <td>{{numberToCurrency revenue}}</td>
  </tr>
  {{/each}}
</table>

<p>Total Quantity: <b>{{totalQuantity}}</b></p>
<p>Total Revenue: <b>{{numberToCurrency totalRevenue}}</b></p>

Now that our numbers are formatted properly you can reload the page
and see our final result:

We’re going to add some graphs and see how Ember components work.

There are many good options when it comes to JavaScript graphing, charting, and
visualizations. I find highcharts to be a good place to get started and it is
free for non-commercial uses! If you find yourself needing more control or
having a very specific requirement you can always look at projects like d3.js.

Adding Highcharts

Let’s download the latest version of highcharts to our vendor/assets/
javascripts directory.

$ wget http://code.highcharts.com/4.1.15/highcharts.js
    -o vendor/assets/javascripts/highcharts-4.1.15.js

And then require the file in app/assets/javascripts/application.js

//= require jquery
//= require accounting-0.3.2
//= require highcharts-4.1.15
//= require_tree .

Creating The Ember Component

Ember makes adding reusable components quite simple. We can add a component
that represents a specific chart we want to show on the screen and have ember
re-render the chart whenever the data changes.

As an example we can add a highcharts column chart to show revenue by product.
Add the component in our app/assets/javascripts/templates/orders.hbs file:

<h1>Orders</h1>

{{column-chart chartId='revenue-by-product'}}

<table class=’table table-striped’>
...

Then we can add the template for the component in app/assets/javascripts/
templates/components/column-chart.hbs:

<div {{bind-attr id='chartId'}} style='width: 100%;'></div>

And finally we can define the component in app/assets/javascripts/components/
column-chart.js:

Dashboard.ColumnChartComponent = Ember.Component.extend({
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
      series: this.series
    });
  },
  willDestroyElement: function() {
    return $("#" + this.chartId).remove();
  }
});

Then when you reload the page it should look result:

Static Orders Chart

Binding Data To The Ember Component

The chart we have is currently always showing the same series because we hard
coded it in the component. Let’s now make this dynamic by adding the data in
the route and using data bindings.

First let’s update the data in our orders route to include a product id.

##### app/assets/javascripts/routes/orders_route.js

Dashboard.OrdersRoute = Ember.Route.extend({
  model: function() {
    return [
      {
        id: 1,
        firstName: 'James',
        lastName: 'Deen',
        quantity: 1,
        revenue: '10.00'
      },
      {
        id: 2,
        firstName: 'Alex',
        lastName: 'Baldwin',
        quantity: 2,
        revenue: '20.00'
      }
    ]
  }
});

And then we can build our chart series in the orders controller
(this is a very simplistic example):

Dashboard.OrdersController = Ember.ArrayController.extend({
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

We can then bind chartSeries in orders.hbs:

<h1>Orders</h1>

{{column-chart chartId='revenue-by-product' series=chartSeries}}

<table class='table table-striped'>
...

And finally use series in our chart component:

##### app/assets/javascripts/components/column-chart.js

Dashboard.ColumnChartComponent = Ember.Component.extend({
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
      series: this.series
    });
  },
  willDestroyElement: function() {
    return $("#" + this.chartId).remove();
  }
});

We then end up with our final dynamic chart rendered by Ember:

https://medium.com/search?q=Ember.js

https://medium.com/p/b11cf922408d
https://medium.com/p/82dc33390fdf
https://medium.com/p/2f9140df5690

https://medium.com/p/18a65d611644

https://github.com/jtescher/example-ember-rails-dashboard
https://github.com/samselikoff/talks

#### Oleg G.Kapranov 24 June 2015
