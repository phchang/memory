'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$interval', '$timeout', function ($scope, $interval, $timeout) {

        var deck = [];

        for (var i = 0; i < 25; i++) {
            deck.push({
                id: i,
                value: i,
                flipped: true
            });
        }

        for (i = 0; i < 25; i++) {
            deck.push({
                id: i,
                value: i,
                flipped: true
            });
        }

        $scope.cards = deck;
        $scope.exposedCard = null;

        $scope.countDown = 1;

        $interval(function () {
            $scope.countDown = $scope.countDown - 1;

            if ($scope.countDown == 0) {
                for (i = 0; i < $scope.cards.length; i++) {
                    $scope.cards[i].flipped = false;
                }
            }
        }, 1000, 10);

        $scope.toggleCard = function(card) {

            var exposed = $scope.exposedCard;

            if (!exposed) {
                card.flipped = true;
                $scope.exposedCard = card
            } else {
                card.flipped = true;
                if (exposed.value == card.value) {
                    $scope.exposedCard = null;
                } else {

                    $timeout(function() {
                        exposed.flipped = false;
                        card.flipped = false;
                        $scope.exposedCard = null;
                    }, 2000);
                }
            }

            $scope.selectedCard = card;
            //card.flipped = true;
            console.log('card = ', card.flipped);
        };
    }]);