(function() {
  var ExchangeBeanResultService;

  ExchangeBeanResultService = (function() {
    ExchangeBeanResultService.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    ExchangeBeanResultService.defaultConfig = {
      headers: ExchangeBeanResultService.headers
    };

    function ExchangeBeanResultService($log, $http, $q) {
      this.$log = $log;
      this.$http = $http;
      this.$q = $q;
      this.$log.debug("constructing ExchangeBeanResultService");
    }

    ExchangeBeanResultService.prototype.findExchangeBeanResults = function(pager) {
      var deferred;
      this.$log.debug("findExchangeBeanResults()");
        this.$log.debug("findExchangeBeanResults()" + angular.toJson(pager));
      deferred = this.$q.defer();
      this.$http.get(baseUrl + "/exchangebeanresult", {
          headers: {
              'params': encodeURIComponent(angular.toJson(pager))
          }
      }).success((function(_this) {
        return function(data, status, headers) {
          _this.$log.info("Successfully find exchangeBeanresult - status " + status);
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers) {
          _this.$log.error("Failed to find exchangeBeanresult - status " + status);
          return deferred.reject(data);
        };
      })(this));
      return deferred.promise;
    };

    return ExchangeBeanResultService;

  })();

    angular.module('sbAdminApp').service('ExchangeBeanResultService', ExchangeBeanResultService);

}).call(this);
