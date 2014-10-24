'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$interval', '$timeout', function ($scope, $interval, $timeout) {

        $scope.level = 1;

        var numCards = 50;
        var numHighlighted = 1;

        var deck = initialize(numCards);
        highlight(deck, numHighlighted);

        $scope.cards = deck;

        $scope.countDown = 1;
        $scope.correctCount = 0;

        $interval(function () {
            $scope.countDown = $scope.countDown - 1;

            if ($scope.countDown == 0) {
                for (var i = 0; i < $scope.cards.length; i++) {
                    $scope.cards[i].selected = false;
                }
            }
        }, 1000, 10);

        $scope.toggleCard = function (card) {

            card.selected = true;

            if (card.highlighted) {
                $scope.correctCount++;

                if ($scope.correctCount == numHighlighted) {
                    $scope.status = "YOU WIN";

                    $timeout(function () {
                        for (var j = 0; j < $scope.cards.length; j++) {
                            $scope.cards[j].highlighted = false;
                            $scope.cards[j].selected = false;
                        }
                        highlight($scope.cards, ++numHighlighted);

                        $scope.countDown = 1;
                        $interval(function () {
                            $scope.countDown = 2;

                            if ($scope.countDown == 0) {
                                for (var i = 0; i < $scope.cards.length; i++) {
                                    $scope.cards[i].selected = false;
                                }
                            }

                            $scope.countDown--;
                        }, 1000, 2);

                        $scope.status = "";
                    }, 3000);
                }
            }

        };
    }]
);

var initialize = function(numCards) {
    var deck = [];

    for (var i = 0; i < numCards; i++) {
        deck.push({
            id: i,
            value: i,
            highlighted: false,
            selected: false
        });
    }

    return deck;
};

var highlight = function(deck, numHighlighted) {
    console.log('highlighting random cards');
    console.log('numHighlighted = ', numHighlighted);

    var highlightCount = 0;

    // todo : this may become inefficient once numHighlighted approaches numCards
    while (highlightCount < numHighlighted) {
        var random = Math.floor(Math.random() * deck.length);

        var randomCard = deck[random];

        console.log('randomCard = ', randomCard.id);

        if (!randomCard.highlighted) {
            randomCard.highlighted = true;
            randomCard.selected = true;
            highlightCount++;
        }
    }
};