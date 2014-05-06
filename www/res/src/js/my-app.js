// Initialize your app
//var myApp = new Framework7();
var myApp = new Framework7({
    fastClicks : false,
	cache: false,
    onBeforePageInit: function (page) {
        // Do something when page just added to DOM   
        // console.log(page);        
    },
    onPageInit: function (page) {
        // Do something on page init
        // console.log(page);  
        //$('body').i18n();
    },
    onPageAfterAnimation: function (page) {
        // Do something on page before animation start
        // console.log(page);
    },
    onPageBeforeAnimation: function (page) {
        // Do something on page ready(centered)
        // console.log(page);
    }
});


// Expose Internal DOM library
var $$ = Framework7.$;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
// Add another view, which is in right panel
/*
var authView = myApp.addView('.view-auth', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
*/

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
/*
$$(document).on('ajaxStart', function () {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});
*/

// Events for specific pages when it initialized
$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
    //console.log(page.name);
    // handle index loader
    if (page.name === 'index' || page.name === 'index.html') {
        // to prevent back url on login
        //alert(page.name);
        if (Object.keys(objUser).length == 0) {
           //mofChangePage('login.html');
           checkPreAuth(false);   
           return;
        }                 
        
        doRefresh = true;                
        
        $('#nickname').html(objUser.first_name);
        
        loadChatInit();		
                
    }
    
    if (page.name === 'login') {
        console.log('login.html pageinit'); 
        //alert('login');
		if (Object.keys(objUser).length == 0) {
			doRefresh = false;
		}
        
        //checkPreAuth(true);       
    }
           
    if (page.name === 'messages') {        
         $$('.demo-remove-callback').on('deleted', function () {
            myApp.alert('Thanks, item removed!', 'Live Chat');
        });
    }

    // Handle Modals Page event when it is init
    if (page.name === 'modals') {
        $$('.demo-alert').on('click', function () {
            myApp.alert('Hello!');
        });
        $$('.demo-confirm').on('click', function () {
            myApp.confirm('Are you feel good today?', function () {
                myApp.alert('Great!');
            });
        });
        $$('.demo-prompt').on('click', function () {
            myApp.prompt('What is your name?', function (data) {
                // @data contains input value
                myApp.confirm('Are you sure that your name is ' + data + '?', function () {
                    myApp.alert('Ok, your name is ' + data + ' ;)');
                });
            });
        });
    }
    //Preloader page events
    if (page.name === 'preloader') {
        $$('.demo-indicator').on('click', function () {
            myApp.showIndicator();
            setTimeout(function () {
                myApp.hideIndicator();
            }, 2000);
        });
        $$('.demo-preloader').on('click', function () {
            myApp.showPreloader();
            setTimeout(function () {
                myApp.hidePreloader();
            }, 2000);
        });
        $$('.demo-preloader-custom').on('click', function () {
            myApp.showPreloader('My text...');
            setTimeout(function () {
                myApp.hidePreloader();
            }, 2000);
        });
    }
    //Swipe to delete events callback demo
    if (page.name === 'swipe-delete') {
        $$('.demo-remove-callback').on('deleted', function () {
            myApp.alert('Thanks, item removed!');
        });
    }
    // Action sheet, we use it on two pages
    if (page.name === 'swipe-delete' || page.name === 'modals' || page.name === 'media-lists') {
        $$('.demo-actions').on('click', function () {
            myApp.actions([
                // First buttons group
                [
                    // Group Label
                    {
                        text: 'Here comes some optional description or warning for actions below',
                        label: true
                    },
                    // First button
                    {
                        text: 'Alert',
                        onClick: function () {
                            myApp.alert('He Hoou!');
                        }
                    },
                    // Another red button
                    {
                        text: 'Nice Red Button ',
                        red: true,
                        onClick: function () {
                            myApp.alert('You have clicked red button!');
                        }
                    },
                ],
                // Second group
                [
                    {
                        text: 'Cancel',
                        bold: true
                    }
                ]
            ]);
        });
    }
    //Messages page
    if (page.name === 'messages') {
		console.log('message to load');
		/*
        var conversationStarted = false;
        var answers = [
            'Yes!',
            'No',
            'Hm...',
            'I am not sure',
            'And what about you?',
            'May be ;)',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus tincidunt erat, a convallis leo rhoncus vitae.'
        ];
		*/
		/*
		myApp.addMessage({
                text: 'totot',
                type: 'sent',
                day: !conversationStarted ? 'Today' : false,
                time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
            });
            */
			/*
        var answerTimeout;
        $$('.ks-messages-form').on('submit', function (e) {
            e.preventDefault();
            alert('input');
            var input = $$(this).find('.ks-messages-input');
            var messageText = input.val();
            if (messageText.length === 0) return;
            // Empty input
            input.val('');
            // Add Message
            myApp.addMessage({
                text: messageText,
                type: 'sent',
                day: !conversationStarted ? 'Today' : false,
                time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
            });
            conversationStarted = true;
            // Add answer after timeout
            if (answerTimeout) clearTimeout(answerTimeout);
            answerTimeout = setTimeout(function () {
                myApp.addMessage({
                    text: answers[Math.floor(Math.random() * answers.length)],
                    type: 'received'
                });
            }, 2000);
			
        });
		*/
        $$('.ks-send-message').on('click', function () {
            $$('.ks-messages-form').trigger('submit');
        });
    }
    // Pull To Refresh Demo
    if (page.name === 'pull-to-refresh') {
        // Dummy Content
        var songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication'];
        var authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers'];
        // Pull to refresh content
        var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        // Add 'refresh' listener on it
        ptrContent.on('refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
                var picURL = 'http://hhhhold.com/88/d/jpg?' + Math.round(Math.random() * 100);
                var song = songs[Math.floor(Math.random() * songs.length)];
                var author = authors[Math.floor(Math.random() * authors.length)];
                var linkHTML = '<li class="item-content">' +
                                    '<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                            '<div class="item-title">' + song + '</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle">' + author + '</div>' +
                                    '</div>' +
                                '</li>';
                ptrContent.find('ul').prepend(linkHTML);
                // When loading done, we need to "close" it
                myApp.pullToRefreshDone();
            }, 2000);
        });
    }

});

// Required for demo popover
$$('.popover a').on('click', function () {
    myApp.closeModal('.popover');
});

// Change statusbar bg when panel opened/closed
$$('.panel-left').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-left');
});
$$('.panel-right').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});


// Generate dynamic page
var dynamicPageIndex = 0;

function createContentPage() {
    mainView.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link">Back</a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-content" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or generate <a href="#" class="ks-generate-page">one more page</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
    return;
}

function goMainTab(link) {
 var newTab = $$(link);
                    if (newTab.length === 0) return;
                    var oldTab = $$('.tabs').find('.tab.active').removeClass('active');
                    newTab.addClass('active');
                    newTab.trigger('show');
                    var clickedParent = $$('.toolbar-inner');
                    
                    clickedParent.find('.active').removeClass('active');
                    $$('a[href="'+link+'"]').addClass('active');
                    
                    if (newTab.find('.navbar').length > 0) {
                        // Find tab's view
                        var viewContainer;
                        if (newTab.hasClass('view')) viewContainer = newTab[0];
                        else viewContainer = newTab.parents('.view')[0];
                        myApp.sizeNavbars(viewContainer);
                    }
                    
}

$$(document).on('click', '.ks-generate-page', createContentPage);

// init textsol
app.initialize();