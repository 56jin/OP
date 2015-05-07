/**
 * Created by Yuan on 2015/3/17.
 */
(function () {
  var CustomerCtrl;

  CustomerCtrl = (function () {
    function CustomerCtrl($scope, $rootScope, $log, $location, CustomerService, toaster) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$log = $log;
      this.$location = $location;
      this.CustomerService = CustomerService;
      this.toaster = toaster;
      this.$log.debug("constructing CustomerCtrl");
      this.customers = [];
      this.customer = this.$rootScope.customer || {};
      this.reward = {};
      this.$rootScope.customer = {};
      this.tabIndex = 1;
      this.pager = {filter: {EQS_telephone: ''}};
      this.$scope.bankCardOptions = {
        data: 'bankCardPager.list',
        enablePaging: true,
        showFooter: true,
        multiSelect: false,
        useExternalSorting: true,
        i18n: "zh-cn",
        enableColumnResize: true,
        showColumnMenu: true,
        totalServerItems: 'bankCardPager.count',
        pagingOptions: {
          pageSizes: [5, 10, 15],
          pageSize: 5,
          currentPage: 1
        },
        columnDefs: [
          {
            field: "bankName",
            displayName: "银行名称"
          },
          {
            field: "bankCardNo",
            displayName: "银行卡号"
          }
        ]
      };
      this.$scope.referrerDetailOptions = {
        data: 'referrerDetailPager.list',
        enablePaging: true,
        showFooter: true,
        multiSelect: false,
        useExternalSorting: true,
        i18n: "zh-cn",
        enableColumnResize: true,
        showColumnMenu: true,
        totalServerItems: 'referrerDetailPager.count',
        pagingOptions: {
          pageSizes: [5, 10, 15],
          pageSize: 10,
          currentPage: 1
        },
        columnDefs: [
          {
            field: "mobile",
            displayName: "注册手机号"
          },
          {
            field: "realName",
            displayName: "注册姓名"
          },
          {
            field: "registrationDate",
            displayName: "注册时间",
            cellFilter: 'date:"yyyy-MM-dd HH:mm"'
          },
          {
            field: "tradeDate",
            displayName: "购买时间",
            cellFilter: 'date:"yyyy-MM-dd HH:mm"'
          }
        ]
      };

      this.$scope.rewardItensOptions = {
          data: 'rewardItensPager.list',
          enablePaging: true,
          showFooter: true,
          multiSelect: false,
          useExternalSorting: true,
          i18n: "zh-cn",
          enableColumnResize: true,
          showColumnMenu: true,
          totalServerItems: 'rewardItensPager.count',
          pagingOptions: {
              pageSizes: [5, 10, 15],
              pageSize: 10,
              currentPage: 1
          },
          columnDefs: [
              {
                  field: "rewardTime",
                  displayName: "交易日期"
              },
              {
                  field: "scene",
                  displayName: "活动类型"
              },
              {
                  field: "rewardType",
                  displayName: "奖励类型"
              },
              {
                  field: "rewardNum",
                  displayName: "奖励数量/金额"
              },
              {
                  field: "exchangeMoney",
                  displayName: "兑换金额"
              }
          ]
      };
    }



    CustomerCtrl.prototype.search = function () {
      this.$log.debug("search()");
      this.pager.pageSize = this.$scope.referrerDetailOptions.pagingOptions.pageSize;
      this.pager.pageNum = this.$scope.referrerDetailOptions.pagingOptions.currentPage;
      this.$log.debug("tabIndex" + this.tabIndex);
      if ("" !== this.pager.filter.EQS_telephone) {
        if (1 === this.tabIndex) {
          return this.findCustomerByMobile();
        } else {
          return this.findReferrerDetails();
        }
      }
    };

    CustomerCtrl.prototype.test = function () {
      this.$log.debug("test()");
    };

    CustomerCtrl.prototype.findReferrerDetails = function () {
      this.$log.debug("findReferrerDetails()");
      this.pager.pageSize = this.$scope.referrerDetailOptions.pagingOptions.pageSize;
      this.pager.pageNum = this.$scope.referrerDetailOptions.pagingOptions.currentPage;
      if ("" !== this.pager.filter.EQS_telephone) {
        return this.CustomerService.findReferrers(this.pager).then((function (_this) {
          return function (data) {
            _this.$log.debug("Promise returned " + data.value.list.length + " Referrers");
            return _this.$scope.referrerDetailPager = data.value;
          };
        })(this), (function (_this) {
          return function (error) {
            _this.$log.error("Unable to get Referrers: " + error);
            return _this.error = error;
          };
        })(this));
      }
    };

    CustomerCtrl.prototype.findReward = function () {
        this.$log.debug("findReferrerDetails()");
        if ("" !== this.pager.filter.EQS_telephone) {
            this.CustomerService.findReward(this.pager.filter.EQS_telephone).then((function (_this) {
                return function (data) {
                    if(!data.value){
                        _this.toaster.pop('warning', '查询失败', '没有该手机号');
                    } else {
                        _this.toaster.pop('success', '查询成功', '');
                    }
                    return _this.reward = data.value;
                };
            })(this), (function (_this) {
                return function (error) {
                    _this.$log.error("Unable to get Customers: " + error);
                    return _this.error = error;
                };
            })(this));
        }
        return this.findRewardItems();
    };

    CustomerCtrl.prototype.findRewardItems = function () {
        this.$log.debug("findRewardItems()");
        this.pager.pageSize = this.$scope.rewardItensOptions.pagingOptions.pageSize;
        this.pager.pageNum = this.$scope.rewardItensOptions.pagingOptions.currentPage;
        if ("" !== this.pager.filter.EQS_telephone) {
            return this.CustomerService.findRewardItems(this.pager).then((function (_this) {
                return function (data) {
                    _this.$log.debug("Promise returned  RewardItems");
                    return _this.$scope.rewardItensPager = data.value;
                };
            })(this), (function (_this) {
                return function (error) {
                    _this.$log.error("Unable to get BankCards: " + error);
                    return _this.error = error;
                };
            })(this));
        }
    };

    CustomerCtrl.prototype.findCustomerByMobile = function () {
      this.$log.debug("findCustomerByMobile()");
      if ("" !== this.pager.filter.EQS_telephone) {
        this.CustomerService.findCustomerByMobile(this.pager.filter.EQS_telephone).then((function (_this) {
          return function (data) {
            if(!data.value){
              _this.toaster.pop('warning', '查询失败', '没有该手机号');
            } else {
              _this.toaster.pop('success', '查询成功', '');
            }
            return _this.customer = data.value;
          };
        })(this), (function (_this) {
          return function (error) {
            _this.$log.error("Unable to get Customers: " + error);
            return _this.error = error;
          };
        })(this));
      }
      return this.findBankCards();
    };

    CustomerCtrl.prototype.findBankCards = function () {
      this.$log.debug("findBankCards()");
      this.pager.pageSize = this.$scope.bankCardOptions.pagingOptions.pageSize;
      this.pager.pageNum = this.$scope.bankCardOptions.pagingOptions.currentPage;
      if ("" !== this.pager.filter.EQS_telephone) {
        return this.CustomerService.findBankCards(this.pager).then((function (_this) {
          return function (data) {
            _this.$log.debug("Promise returned " + data.value.list.length + " BankCards");
            return _this.$scope.bankCardPager = data.value;
          };
        })(this), (function (_this) {
          return function (error) {
            _this.$log.error("Unable to get BankCards: " + error);
            return _this.error = error;
          };
        })(this));
      }

    };

    CustomerCtrl.prototype.saveCustomer = function () {
      this.$log.debug("saveCustomer()");
      return this.CustomerService.saveCustomer(this.customer).then((function (_this) {
        return function (data) {
          _this.$log.debug("save customer successfully");
          _this.toaster.pop('success', data.message.summary, data.message.detail);
          return _this.$location.path("/dashboard/customer");
        };
      })(this), (function (_this) {
        return function (error) {
          _this.$log.error("Unable to save customer: " + error);
          _this.toaster.pop('error', error.message.summary, error.message.detail);
          return _this.error = error;
        };
      })(this));
    };


    return CustomerCtrl;

  })();

  angular.module('sbAdminApp').controller('CustomerCtrl', CustomerCtrl);

}).call(this);

