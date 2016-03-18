/*jslint browser: true*/
/*global console*/

var app = app || {};
app.pages = app.pages || {};

var welcomescreen;

app.pages.IndexPageController = function (app, $$) {
  'use strict';
  
  // Init method
  (function () {
    var options = {
	  'open': false,
      'bgcolor': '#0da6ec',
      'fontcolor': '#fff',
      'onOpened': function () {
        console.log("welcome screen opened");
      },
      'onClosed': function () {
        console.log("welcome screen closed");
      }
    },
    welcomescreen_slides = [
      {
        id: 'slide0',
        picture: '<div class="tutorialicon"><img src="img/ecare-w.png" width="256" height="256"><!--♥--></div>',
        text: 'Bienvenue dans le tutorial de présentation. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
		//text: 'Bienvenue dans le tutorial de présentation. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
      },
      {
        id: 'slide1',
        picture: '<div class="tutorialicon">✲</div>',
        text: 'Prend en charge toute une variété de dispositifs connectés, de sorte que vous pouvez suivre toutes vos fonctions vitales partout et à tout moment.'
      },
      {
        id: 'slide2',
        picture: '<div class="tutorialicon">♫</div>',
        text: 'This is slide 3'
      },
      {
        id: 'slide3',
        picture: '<div class="tutorialicon">☆</div>',
        text: 'Thanks for reading! Enjoy this app or go to <a class="tutorial-previous-slide" href="#">previous slide</a>.<br><br><a class="tutorial-close-btn" href="#">End Tutorial</a>'
      }
    ],
    welcomescreen = app.welcomescreen(welcomescreen_slides, options);
    
    $$(document).on('click', '.tutorial-close-btn', function () {
      welcomescreen.close();
    });

	/*
    $$('.tutorial-open-btn').click(function () {
      welcomescreen.open();  
    });
	*/
    
	$$(document).on('click', '.tutorial-open-btn', function (e) {
      welcomescreen.open();  
    });
	
    $$(document).on('click', '.tutorial-next-link', function (e) {
      welcomescreen.next(); 
    });
    
    $$(document).on('click', '.tutorial-previous-slide', function (e) {
      welcomescreen.previous(); 
    });
  
  }());

};