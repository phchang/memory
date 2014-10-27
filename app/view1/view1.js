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
        $scope.timeout = 15000;
        $scope.timeleft = 100; // percentage
        $scope.gamestarted = false;
        $scope.status = "NOT_STARTED";
        $scope.correctCount = 0;

        var numCards = 20;
        var numHighlighted = 1;

        $scope.cards = initialize(numCards);

        var stop;
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
                    $interval.cancel(stop);
                    $scope.timeleft = 100;
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

                            var startTime = new Date().getTime();
                            var endTime = startTime + $scope.timeout;

                            stop = $interval(function () {
                                if (new Date().getTime() > endTime) {
                                    console.log('STOP THE GAME!');
                                    stopTimer();
                                }

                                $scope.timeleft = ((endTime - new Date().getTime())/$scope.timeout) * 100;
                            }, 100);
                        }, 2000);

                        $scope.status = "";
                    }, 1000);
                }
            } else {
                // the user made an incorrect selection
                $scope.timeleft = 100; // todo make a function call out of this
                $interval.cancel(stop);

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

                        stop = startTimer();

                    }, 2000);

                    $scope.status = "";
                }, 3000);
            }
        };

        $scope.start = function() {
            if (!$scope.gamestarted) {

                $scope.cards = initialize(numCards);
                highlightAndSelectRandomCards($scope.cards, numHighlighted);

                $timeout(function() {
                    resetSelections($scope.cards);

                    $scope.correctCount = 0;
                    $scope.gamestarted = true;
                    initializing = false;

                    stop = startTimer();

                }, 2000);

                $scope.status = "";


            }
        };

        var startTimer = function () {
            var startTime = new Date().getTime();
            var endTime = startTime + $scope.timeout;

            return $interval(function () {
                if (new Date().getTime() > endTime) {
                    console.log('STOP THE GAME!');
                    stopTimer();
                }

                $scope.timeleft = ((endTime - new Date().getTime()) / $scope.timeout) * 100;
            }, 100);
        };

        var stopTimer = function() {

            console.log('Stopping the game');

            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                console.log('stopping');

                $scope.gamestarted = false;
                $scope.status = 'LOST';

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
            }
        };
    }]
);

var initialize = function(numCards) {
    var deck = [];

    for (var i = 0; i < numCards; i++) {
        deck.push({ id: i, highlighted: false, selected: false, incorrect: false});
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