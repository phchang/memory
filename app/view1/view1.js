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
        $scope.timeleft = 100; // percentage
        $scope.gamestarted = false;

        // 15 seconds = 15,000 ms
        // every 100 ms
        $interval(function() {
            $scope.timeleft = $scope.timeleft - 0.7;
        }, 100, 150);

        var numCards = 20;
        var numHighlighted = 1;

        var deck = initialize(numCards);
        highlightAndSelectRandomCards(deck, numHighlighted);

        $scope.cards = deck;
        $scope.correctCount = 0;

        // reset the selections when the timer is done
        $timeout(function () {
            resetSelections($scope.cards);
            $scope.gamestarted = true;
        }, 2000);

        var initializing = false;

        $scope.toggleCard = function (card) {

            if (initializing) {
                return;
            }

            card.selected = true;

            if (card.highlighted) {
                $scope.correctCount++;

                if ($scope.correctCount == numHighlighted) {
                    // level is complete
                    $scope.gamestarted = false;
                    $scope.status = "WON";

                    $scope.level++;

                    // reinitialize for the next level
                    initializing = true;
                    $timeout(function () {
                        $scope.cards = initialize(numCards);
                        highlightAndSelectRandomCards($scope.cards, ++numHighlighted);

                        $timeout(function() {
                            resetSelections($scope.cards);

                            $scope.correctCount = 0;
                            $scope.gamestarted = true;
                            initializing = false;
                        }, 2000);

                        $scope.status = "";
                    }, 1000);
                }
            } else {
                // the user made an incorrect selection
                $scope.gamestarted = false;
                $scope.status = 'LOST';
                card.incorrect = true;

                // show the remaining cards
                var cards = $scope.cards;

                for (var i = 0; i < cards.length; i++) {
                    var c = cards[i];

                    if (c.highlighted && !c.selected) {
                        c.missed = true;
                        c.value = 'X';
                    }
                }

                initializing = true;

                $timeout(function () {
                    $scope.cards = initialize(numCards);
                    highlightAndSelectRandomCards($scope.cards, numHighlighted);

                    $timeout(function() {
                        resetSelections($scope.cards);

                        $scope.correctCount = 0;
                        $scope.gamestarted = true;
                        initializing = false;

                    }, 2000);

                    $scope.status = "";
                }, 3000);
            }
        };

        $scope.start = function() {
            console.log('start clicked!');
        }
    }]
);

var initialize = function(numCards) {
    var deck = [];

    for (var i = 0; i < numCards; i++) {
        deck.push({
            id: i,
            highlighted: false,
            selected: false,
            incorrect: false
        });
    }

    return deck;
};

var highlightAndSelectRandomCards = function(deck, numHighlighted) {
    var highlightCount = 0;

    // todo : there is probably a better way to do this when highlightCount approaches numHighlighted
    while (highlightCount < numHighlighted) {
        var randomCard = deck[Math.floor(Math.random() * deck.length)];

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