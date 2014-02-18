angular.module('omniwallet', ['ngRoute'],
  function($routeProvider, $locationProvider) {
    $routeProvider.when('/wallet/:page?', {
      templateUrl: function(route) {       
        //new views added here
        var availableViews = ['overview','addresses','send', 'history'];
        
        var viewFound = availableViews.indexOf(route.page);
        if( viewFound == -1 ) 
          route.page = 'overview';
        
        var view = '/wallet_' + route.page + '.html';
        //DEBUG console.log(view, route.page, view == '/wallet_addresses.html')
        return view
      }
    }).otherwise({ redirectTo: '/wallet' });
    $routeProvider.when('/trade/:page?', {
       templateUrl: function(route) {       
        var availableViews = ['overview','book','charts', 'alerts'];
        
        var viewFound = availableViews.indexOf(route.page);
        if( viewFound == -1 ) 
          route.page = 'overview';
        
        var view = '/trade_' + route.page + '.html';
        //DEBUG console.log(view, route.page, view == '/wallet_addresses.html')
        return view
       }
    }).when('/explorer/:page?', {
       templateUrl: function(route) {       
        var availableViews = ['overview','assets','bookmarks', 'following'];
        
        var viewFound = availableViews.indexOf(route.page);
        if( viewFound == -1 ) 
          route.page = 'overview';
        
        var view = '/explorer_' + route.page + '.html';
        //DEBUG console.log(view, route.page, view == '/wallet_addresses.html')
        return view
       }
    }).otherwise({ redirectTo: '/explorer' });
    $routeProvider.when('/about/:page?', {
       templateUrl: function(route) {       
        var availableViews = ['omniwallet','mastercoin','contact', 'help'];
        
        var viewFound = availableViews.indexOf(route.page);
        if( viewFound == -1 ) //Default view
          route.page = 'omniwallet';
        
        var view = '/about_' + route.page + '.html';
        //DEBUG console.log(view, route.page, view == '/wallet_addresses.html')
        return view
       }
    }).when('/', {
       templateUrl: 'homepage.html',
       controller: HomeCtrl
    }).otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true).hashPrefix('!');
});

function HomeCtrl($templateCache) {
  //DEV ONLY
  $templateCache.removeAll()
}
function ExplorerCtrl() {
}
function TradeCtrl() {
}
function WalletController() {
  console.log('initialized wallet')
}

function AboutCtrl($scope, $location) {
}

function Ctrl($scope, $route, $routeParams, $location) {
  
  $scope.$route = $route
  $scope.$location = $location
     
  $scope.templates = { 
        'header': 'header.html', 
        'footer': 'footer.html',
        'sidecar': 'sidecar.html'
  };

}

function NavigationController($scope, $http) {
    $scope.values = {};
    
    $scope.getNavData = function() {
      console.log('init 0');
    }

}

function BTCController($scope, $http) {
    // Scope members
    $scope.transactions = {};
    $scope.currency = 'MSC'
    
    $scope.getData = function getData() {  
      var file =  '/v1/transaction/general/TMSC_0001.json';
      $http.get( file, {}).success(
        function (data, status, headers, config) {
          $scope.transactions = data;
          console.log($scope.transactions);
      });
    }
}

function WalletHistoryController($scope, $http) {
  console.log('initialized wallet history')
  $scope.getData = function getData(address) {
    var file = '/v1/address/addr/' + address + '.json'; 
    $http.get( file, {} ).success(
      function(data, status, headers, config) {

        $scope.address = data.address;

        delete data.address;
        delete data.balance;
        
        var transaction_data = []
        angular.forEach(data[0], function(msc_tx, tx_type ) {
          if( msc_tx instanceof Array && msc_tx.length != 0 ) {
            console.log(tx_type, msc_tx);
            transaction_data = transaction_data.concat(msc_tx);
          }
        });
        
        angular.forEach(data[1], function(tmsc_tx, tx_type) {
          if( tmsc_tx instanceof Array && tmsc_tx.length != 0 ) {
            console.log(tx_type, tmsc_tx);
            transaction_data = transaction_data.concat(tmsc_tx);
          }
        });

        //sort by date, ascending
        transaction_data = transaction_data.sort(function(a,b) {
            return b.tx_time - a.tx_time;
        });
        
        //DEBUG angular.forEach(transaction_data, function(transaction, index) {
        //DEBUG console.log(new Date(Number(transaction.tx_time)))
        //DEBUG });

        $scope.history = transaction_data;
      });
  }
}

function SidecarController($scope, $http) {
    $scope.values = {};
    $scope.setView = function(viewName) {
        $scope.view = $scope.sidecarTemplates[viewName]
    };
    $scope.getView = function() {
       return $scope.view;
    }
    $scope.sidecarTemplates = {
          'explorer':'explorer_sc.html',
          'about': 'about_sc.html',
          'trade': 'trade_sc.html',
          'wallet': 'wallet_sc.html'
    };

}