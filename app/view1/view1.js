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
        $scope.timeleft = resetTimeLeft(); // represents a percentage
        $scope.gamestarted = false;
        $scope.status = "NOT_STARTED";
        $scope.gamestatus = "";
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

            if ($scope.gamestatus == 'WON') {
                return;
            }

            if (card.highlighted) {

                // prevent correctCount from being incremented if the card has already been chosen
                if (!card.selected) {
                    card.selected = true;
                    $scope.correctCount++;
                } else {
                    return;
                }

                if ($scope.correctCount == numHighlighted) {
                    // level is complete
                    $interval.cancel(stop); // stop the progress bar, timer
                    $scope.timeleft = resetTimeLeft();
                    $scope.gamestarted = false;
                    $scope.status = "WON";
                    $scope.level++;

                    // reinitialize for the next level
                    initializing = true;

                    if ($scope.level > numCards) {
                        // game is over
                        console.log('ending the game');
                        $scope.level = "WIN!";
                        $scope.gamestatus = "WON";
                        return;
                    }

                    // give a little extra time before moving to the next level
                    $timeout(function () {
                        $scope.start(true);
                        $scope.correctCount = 0;
                    }, 1000);
                }
            } else {
                // the user made an incorrect selection
                card.incorrect = true;
                stopTimer();

                $timeout(function () { $scope.start(); }, 3000);
            }
        };

        $scope.start = function(incrementNumHighlighted) {

            if (angular.isDefined(incrementNumHighlighted) && incrementNumHighlighted) {
                ++numHighlighted;
            }

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
        deck.push({
            id: i,
            highlighted: false, // indicates if the player needs to click this card
            selected: false,    // if the player clicks it, selected = true
            incorrect: false    // set to true if player clicks a card that is not highlighted
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

var resetTimeLeft = function() {
    return 100;
};