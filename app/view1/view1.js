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

        var numCards = 20;
        var numHighlighted = 1;

        var deck = initialize(numCards);
        highlight(deck, numHighlighted);

        $scope.cards = deck;

        $scope.countDown = 1;
        $scope.correctCount = 0;

        $interval(function () {

            if ($scope.countDown == 0) {
                resetSelections($scope.cards);
            }

            $scope.countDown = $scope.countDown - 1;

        }, 1000, 2);

        var initializing = false;

        $scope.toggleCard = function (card) {

            if (initializing) {
                return;
            }

            card.selected = true;

            if (card.highlighted) {
                $scope.correctCount++;

                if ($scope.correctCount == numHighlighted) {
                    $scope.status = "YOU WIN";

                    $timeout(function () {
                        initializing = true;
                        $scope.level++;
                        $scope.cards = initialize(numCards);
                        highlight($scope.cards, ++numHighlighted);

                        $scope.countDown = 1;

                        $timeout(function() {
                            resetSelections($scope.cards);

                            $scope.correctCount = 0;
                            initializing = false;
                        }, 2000);

                        $scope.status = "";
                    }, 1000);
                }
            } else {
                card.incorrect = true;
                console.log("selected card not highlighted");
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
            selected: false,
            incorrect: false
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

var resetSelections = function(deck) {
  for (var i = 0; i < deck.length; i++) {
      deck[i].selected = false;
  }
};