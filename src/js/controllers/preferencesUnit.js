'use strict';

angular.module('copayApp.controllers').controller('preferencesUnitController', function($scope, $log, configService, go, walletService, profileService) {

  var config = configService.getSync();

  $scope.currentUnit = config.wallet.settings.unitCode;

  $scope.unitList = [
    {
      name: 'duffs (1,000,000 duffs = 1 Dash)',
      shortName: 'duffs',
      value: 1,
      decimals: 0,
      code: 'bit',
    },
    {
      name: 'DASH',
      shortName: 'DASH',
      value: 100000000,
      decimals: 8,
      code: 'btc',
    }
  ];

  $scope.save = function(newUnit) {
    var opts = {
      wallet: {
        settings: {
          unitName: newUnit.shortName,
          unitToSatoshi: newUnit.value,
          unitDecimals: newUnit.decimals,
          unitCode: newUnit.code,
        }
      }
    };

    configService.set(opts, function(err) {
      if (err) $log.warn(err);

      go.preferencesGlobal();
      $scope.$emit('Local/UnitSettingUpdated');

      walletService.updateRemotePreferences(profileService.getClients(), {}, function() {
        $log.debug('Remote preferences saved');
      });
    });
  };
});
