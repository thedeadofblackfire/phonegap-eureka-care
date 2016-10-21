
// ---------------------
// TREATMENTS
// ---------------------
var info_date = {}; 
var current_treatment_page = 0;
var current_treatment_report_page = 0;
var objSessionTreatments = {};

app.treatments = {};

app.treatments.constant = {};
app.treatments.constant.STATUS_TODAY_BEFORE           = app.treatments.constant.STATUS_TODAY_BEFORE         || 0;
app.treatments.constant.STATUS_TODAY                  = app.treatments.constant.STATUS_TODAY                || 1;
app.treatments.constant.STATUS_TODAY_AFTER            = app.treatments.constant.STATUS_TODAY_AFTER          || 2;

app.treatments.constant.STATUS_PENDING                = app.treatments.constant.STATUS_PENDING              || 0;
app.treatments.constant.STATUS_COMPLETED              = app.treatments.constant.STATUS_COMPLETED            || 1;
app.treatments.constant.STATUS_INPROGRESS             = app.treatments.constant.STATUS_INPROGRESS           || 2;
app.treatments.constant.STATUS_COMPLETEDWITHERRORS    = app.treatments.constant.STATUS_COMPLETEDWITHERRORS  || 3;


app.treatments.init = function() {
	console.log('TREATMENTS - init');
	
    objUserTreatments = dbAppUserTreatments.get();   
    // @todo should be clean the old treatments to archives
    
    // @todo check on server if connected new production file or treatment to parse
    // if online, check if new treatment on server or wait a push notification ???
    
    dbAppUserTreatments.set(objUserTreatments);
};

// load 7 last days
app.treatments.load = function() {
        console.log('TREATMENTS - loadTreatment');
        
        // show loading icon
        mofLoading(true);
   
        current_treatment_page++;
        var last_days = 7;

        $.ajax({
              url: API+"/gettreatment",
              datatype: 'json',      
              type: "post",
              data: {office_seq: objUser.office.office_seq, patient_user_seq: objUser.uuid, last_days: last_days, page: current_treatment_page},   
              success:function(res){                    
                 console.log(res);
     
                 //var str = generatePageArchive(res);
               
                 mofLoading(false); 

                 /*
                $.each(res.items, function(k, v) { 
                    console.log(k+' | '+v.delivery_day);
                });        
                */                
                
                // save local storage
                
                app.treatments.processLocalNotification(res.items);
                //mainView.loadContent(str);
           
              },
              error: function(jqXHR, textStatus, errorThrown) {
				 mofLoading(false);  
                 alert('Error loading datas, try again!');
				 console.log(textStatus);
				 console.log(errorThrown);
              }
           });
           
        return true;
}

app.treatments.displayTreatmentPage = function(page)
{        
        var delivery = page.query.delivery;
        if (delivery === undefined) {
                d = new Date();
                delivery = app.date.formatyyyymmdd(d);
        }
        console.log('query id='+delivery);
             
        info_date = app.date.formatDateToObject(delivery);
                  
        // show loading icon
        //mofLoading(true);
        
        var data = {};        
        data.info_date = info_date;
        data.width = app.treatments.calculeWidth();
        data.pill = app.treatments.renderPill(data.width);
        //$('body').i18n();
        //data.url_edit = 'frames/edit.html?address='+app.convertAddressToId(address)+'&nocache=1&rand='+new Date().getTime();

        // And insert generated list to page content
        var content = $$(page.container).find('.page-content').html();       
        content = fwk.render(content, data, false);      
        $$(page.container).find('.page-content').html(content);
        
        var navcontent = $$(page.navbarInnerContainer).html();          
        navcontent = fwk.render(navcontent, data, false);      
        //alert(navcontent);
        $$(page.navbarInnerContainer).html(navcontent);
                       
            // jQuery(document).ready(function($){	
               
                // Adjust canvas size when browser resizes
                $(window).resize( app.treatments.respondPill );


                
              $('.current_date').html(info_date.label_current+'<br>'+info_date.label_current_day);
              //$('.current_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_today+'&nocache=1');
              $('.current_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_today+'\')');
              
              //$('.prev_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_prev+'&nocache=1');
              // $('.next_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_next+'&nocache=1');
              $('.prev_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_prev+'\')');
               $('.next_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_next+'\')');
  
              //mainView.showNavbar();
        //mofLoading(false);     
        // mainView.loadContent(str);
        //$('.device-page').html(str);
            
             /*
           var contacts = JSON.parse(localStorage.getItem("fw7.ontacts"));
            if (query && query.id) {
                contact = new Contact(_.find(contacts, { id: query.id }));
            }
            */
        
            //$('.device-page').html(viewTemplate({ model: params.model }))
            //bindEvents(params.bindings);
            
 
        return true;
};
  
app.treatments.navigatePageTreatment = function(delivery) {
    console.log('page update id='+delivery);
    
    info_date = app.date.formatDateToObject(delivery);

    app.treatments.respondPill();  
                   
    $('.current_date').html(info_date.label_current+'<br>'+info_date.label_current_day);
    //$('.current_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_today+'&nocache=1');
    $('.current_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_today+'\')');
              
    $('.prev_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_prev+'\')');
    $('.next_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_next+'\')');
  
}; 


app.treatments.displayPageTreatmentReport = function(page) {        
        var delivery = page.query.delivery;
        if (delivery === undefined) {
                d = new Date();
                delivery = app.date.formatyyyymmdd(d);
        }
        console.log('query id='+delivery);
             
        info_date = app.date.formatDateToObject(delivery);
                  
        // show loading icon
        //mofLoading(true);
        
        //objUserTreatments
        
        //i18n.t('description.currentlyactivechats')
        
        var data = {};        
        data.info_date = info_date;
        data.width = app.treatments.calculeWidth();
        //data.url_edit = 'frames/edit.html?address='+app.convertAddressToId(address)+'&nocache=1&rand='+new Date().getTime();

        // And insert generated list to page content
        var content = $$(page.container).find('.page-content').html();          
        content = fwk.render(content, data, false);      
        $$(page.container).find('.page-content').html(content);
        
        var navcontent = $$(page.navbarInnerContainer).html();          
        navcontent = fwk.render(navcontent, data, false);      
        //alert(navcontent);
        $$(page.navbarInnerContainer).html(navcontent);
 
        $('.current_date').html(info_date.label_current+'<br>'+info_date.label_current_day);
        $('.current_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_today+'\')');
              
        $('.prev_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_prev+'\')');
        $('.next_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_next+'\')');

        /*
        // Generate new items HTML
            var html = '';
            for (var i = 1; i <= 20; i++) {
              html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
            }
         
            // Append new items
            $$('.page-archives > .list-block ul').append(html);
        */
               
        var last_days = 14; 

        if (Object.keys(objSessionTreatments).length == 0) {
            console.log('init objSessionTreatments');
            current_treatment_report_page++;
            $.ajax({
                  url: API+"/gettreatment",
                  datatype: 'json',      
                  type: "post",
                  data: {office_seq: objUser.office.office_seq, patient_user_seq: objUser.uuid, last_days: last_days, page: current_treatment_report_page},   
                  success:function(res){                    
                     console.log(res);
                    
                     objSessionTreatments = fwk.collectionMerge(objSessionTreatments, res.items);                     
                     
                     app.treatments.displayReportItems(res.items);                                 
               
                  },
                  error: function(jqXHR, textStatus, errorThrown) {				  
                     console.log('Error loading datas, try again!');
                     console.log(textStatus);
                     console.log(errorThrown);
                  }
             });     
        } else {
            console.log('preload objSessionTreatments');
            app.treatments.displayReportItems(objSessionTreatments);                 
        }
               
        // infinite scroll                      
               
        // Loading flag
        var loading = false;
                 
        // Attach 'infinite' event handler
        $$('.page-archives.infinite-scroll').on('infinite', function () {
         
          // Exit, if loading in progress
          if (loading) return;
         
          // Set loading flag
          loading = true;
          
          current_treatment_report_page++;           
         
          $.ajax({
              url: API+"/gettreatment",
              datatype: 'json',      
              type: "post",
              data: {office_seq: objUser.office.office_seq, patient_user_seq: objUser.uuid, last_days: last_days, page: current_treatment_report_page},   
              success:function(res){                    
                 console.log(res);
                 
                 // Reset loading flag
                 loading = false;
                 
                 if (Object.keys(res.items).length == 0) { 
                      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                      fw7.detachInfiniteScroll($$('.page-archives.infinite-scroll'));
                      // Remove preloader
                      $$('.page-archives > .infinite-scroll-preloader').remove();
                      return;
                 }
                
                 objSessionTreatments = fwk.collectionMerge(objSessionTreatments, res.items);
                     
                 app.treatments.displayReportItems(res.items);                
           
              },
              error: function(jqXHR, textStatus, errorThrown) {				  
                 console.log('Error loading datas, try again!');
				 console.log(textStatus);
				 console.log(errorThrown);
              }
          });  
         
        });      
      
        return true;
};

app.treatments.stats = {
    totalDays: 0,
    totalDrugProcessed: 0,
    totalSuccess: 0,
    totalError: 0,
    currentPercent: 100,
};

app.treatments.updateReportPercent = function() {
    var percent = (app.treatments.stats.totalSuccess / (app.treatments.stats.totalSuccess + app.treatments.stats.totalError)) * 100;
    percent = percent.toFixed(2);
    //console.log(app.treatments.stats.totalSuccess + ' ' + app.treatments.stats.totalError);
    var str_day = calendarTranslate.day+(app.treatments.stats.totalDays > 1?'s':'')
    $('.percent').html(percent+'%, '+app.treatments.stats.totalDays+' '+str_day);
                
};

app.treatments.displayReportItems = function(items) {
        console.log('displayReportItems ' + Object.keys(items).length);               
        
        var currentTodayTime = app.date.getTodayTime();
        console.log('currentTodayTime='+currentTodayTime);
        
        // Generate new items HTML
        var html = '';   
        $.each(items, function(k, v) { 
           if (v.status_today != app.treatments.constant.STATUS_TODAY_AFTER) {        
                  html += '<li class="item-content" style="z-index:10;background-color:#B9CBCE;color:#4B6968;border-top:0px solid #9797A6;border-bottom:0px solid #646473;box-shadow: 0px 3px 10px #646473;"><div class="item-inner"><div class="item-title"><i class="icon ion-calendar" style="color:#4B6968"></i> ' +  app.date.formatDateToLabel(k) + '</div></div></li>';
               
                  app.treatments.stats.totalSuccess += v.stats.totalSuccess;
                  app.treatments.stats.totalError += v.stats.totalError;
                  app.treatments.stats.totalDrugProcessed += (v.stats.totalSuccess + v.stats.totalError);
                  app.treatments.stats.totalDays++;
                  
                  $.each(v.children, function(delivery_key, delivery_item) { 
                    //html += '<li class="item-content" ><div class="item-inner"><div class="item-title">Item ' + delivery_key + '</div></div></li>';
                   
                    // get today current time                      
                    var deliveryT = parseInt(delivery_item.delivery_time,10);  
                    
                    var background = 'transparent';
                    
                    var delivery_icon = 'ion-ios7-circle-filled';   // ion-ios7-circle-outline         
                    var delivery_color = '#6DC4EF'; // app.treatments.constant.STATUS_PENDING
                    if (delivery_item.status == app.treatments.constant.STATUS_COMPLETED) {
                        delivery_color = '#9FDDB3';
                        delivery_icon = 'ion-ios7-checkmark';
                    } else if (delivery_item.status == app.treatments.constant.STATUS_INPROGRESS) {
                        // today
                        if (delivery_item.stats.totalPending == 0 && delivery_item.stats.totalError == 0) {
                            delivery_color = '#FFA64C';
                            delivery_icon = 'ion-ios7-checkmark';
                        } else if (delivery_item.stats.totalPending == 0 && delivery_item.stats.totalError > 0) {
                            delivery_color = '#FC8A70';
                            delivery_icon = 'ion-ios7-close';
                        } else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY) {
                                if (currentTodayTime > (deliveryT + 30)) {
                                    // error
                                   delivery_color = '#FC8A70';
                                   delivery_icon = 'ion-ios7-close';
                                } else if (currentTodayTime >= deliveryT) {
                                    // current in progress
                                   delivery_color = '#FFA64C';
                                   background = '#FFDFBF';
                                   delivery_icon = 'ion-ios7-alarm';
                                }        
                        }
                        
                    } else if (delivery_item.status == app.treatments.constant.STATUS_COMPLETEDWITHERRORS) {
                        delivery_color = '#FC8A70';
                        delivery_icon = 'ion-ios7-close';
                    }
                    
                    var html_detail = '<div class="row no-gutter"><div class="col-50">';
                    var total_drug = 0;
                    $.each(delivery_item.children, function(bag_key, bag_item) {                         
                        $.each(bag_item.children, function(drug_key, drug_item) {   
                            var mark;
                            if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_AFTER) mark = '<i class="icon ion-minus" style="color:#6DC4EF"></i>';
                            else if (drug_item.validate_taking == '1') mark = '<i class="icon ion-checkmark" style="color:#9FDDB3"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_BEFORE && drug_item.validate_taking == '0') mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY && drug_item.validate_taking == '0') {
                                                                                  
                                //console.log(currentTodayTime + ' ' + deliveryT);
                                if (currentTodayTime < deliveryT) {
                                    // is pending
                                    mark = '<i class="icon ion-flag" style="color:#6DC4EF"></i>';
                                } else if (currentTodayTime > (deliveryT + 30)) {
                                    // error
                                    mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                                } else if (currentTodayTime >= deliveryT) {
                                    // in progress
                                    mark = '&nbsp;<i class="icon ion-alert-circled" style="color:#FFA64C"></i>';
                                }                                
                                                          
                            }                            
                            
                            //if (total_drug == 0) html_detail += '<div class="col-50">';
                            if (total_drug == 3)  html_detail += '</div><div class="col-50">';
                            html_detail += mark+' '+drug_item.drug_name+'<br>';
                            
                            total_drug++;
                        });
                    });
                    html_detail += '</div></div>';
                    
                     //<span class="badge" style="background-color:'+delivery_color+';">'+delivery_item.stats.totalDrug+'</span>
                     html += '<li style="width:100%;background-color:'+background+';border-bottom:1px solid #DBDBEA;border-right:10px solid '+delivery_color+';">'+
                            //'<a href="#" class="item-link item-content">'+
                            '<div class="item-inner" style="border:none;">'+
                            '<div class="item-title-row">'+
                            '<div class="item-title" style="margin-left:15px;"><i class="icon ion-clock" style="color:#000"></i> '+ delivery_item.display_delivery_time+'</div>'+
                            '<div class="item-after"><i class="icon size-24 '+delivery_icon+'" style="color:'+delivery_color+';"></i></div>'+
                            '</div>'+
                            '</div>'+
                            //'<div class="item-subtitle">New messages from John Doe</div>'+
                            '<div class="item-text" style="margin-left:13px;font-size:9px;/*font-family:arial sans-serif;*/color:#4B6968;line-height:110%;">'+
                            html_detail+                            
                            '</div>'+                          
                            //'</a>'+
                            '</li>';
                            
                     /*       
                    html += '<li class="accordion-item" style="background-color:'+background+';border-bottom:1px solid #DBDBEA;border-right:6px solid '+delivery_color+';"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner" style="border:none;">'+
                            '<div class="item-title"><i class="icon ion-clock" style="color:#000"></i> '+ delivery_item.display_delivery_time+' </div>'+
                            '<div class="item-after"><span class="badge" style="background-color:'+delivery_color+';">'+delivery_item.stats.totalDrug+'</span></div>'+
                            '</div></a>'+
                            '<div class="accordion-item-content">'+
                            '<div class="content-block" style="font-size:10px;color: #4B6968;line-height:90%;">'+
                            html_detail+                            
                            '</div>'+
                            '</div>'+
                            '</li>';
                     */       
                  
                  });
                  
             }
        });
         
        // Append new items
        $$('.page-archives > .list-block ul').append(html);
        
        // update percent
        app.treatments.updateReportPercent();
        
        return true;
};

app.treatments.localNotificationInit = function() {
    console.log('localNotificationInit');
        /*
        window.plugin.notification.local.onadd = function (id, state, json) {
            console.log('onadd '+id+' state='+state+' '+JSON.stringify(json));
        };
        */
       /*
            window.plugin.notification.local.ontrigger  = function (id, state, json) {
                console.log('ontrigger '+id+' state='+state+' '+JSON.stringify(json));
            };
            */
            
	cordova.plugins.notification.local.on("click", function (notification) {
		console.log(notification);
		//console.log(state);
    alert(notification.id + ' ' +notification.text);
	 json = JSON.parse(notification.data);
	 console.log(json);
                // need to have the objUser preloaded
       //         app.treatments.createPopupDelivery(json.delivery_dt);
	});

	/*
            window.plugin.notification.local.onclick   = function (id, state, json) {
                console.log('onclick  '+id+' state='+state+' '+JSON.stringify(json));
                json = JSON.parse(json);
                // need to have the objUser preloaded
                app.treatments.createPopupDelivery(json.delivery_dt);
            };
        */
};

app.treatments.localNotificationCancelAll = function() {
	cordova.plugins.notification.local.cancelAll(function() {
		console.log('All notifications have been canceled');
		alert("done");
	}, this);
	/*
  window.plugin.notification.local.cancelAll(function() {
             console.log('All notifications have been canceled');
        }); 
		*/
};

app.treatments.localNotificationGetScheduledIds = function() {
	cordova.plugins.notification.local.getAll(function (notifications) {
console.log(notifications);
});
/*
  window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
             console.log('Scheduled IDs: ' + scheduledIds.join(' ,'));
        }); 
		*/
};

// add new local notification for upcoming days 
app.treatments.processLocalNotification = function(data) {
   
        var now = new Date().getTime();
        //_30_seconds_from_now = new Date(now + 30*1000);
        var _60_seconds_from_now = new Date(now + 60*1000);

        // status_today: before today (0), today (1), after today (2)
        // status: pending(0), completed(1), inprogress(2) (mix of completed/pending), completedwitherror(3)
        // ios limits to first 64 scheduled local notifications.
        $.each(data, function(k_day, v_day) { 
            console.log(k_day+' | '+v_day.delivery_day);
            
            // force update in storage
            objUserTreatments[k_day] = v_day;
                      
            if (v_day.status_today === app.treatments.constant.STATUS_TODAY_AFTER || v_day.status_today === app.treatments.constant.STATUS_TODAY) {
                if (v_day.status === app.treatments.constant.STATUS_PENDING || v_day.status === app.treatments.constant.STATUS_INPROGRESS) {
                     $.each(v_day.children, function(k_delivery, v_delivery) { 
                        console.log(k_delivery+' | '+v_delivery.delivery_dt+ ' | '+v_delivery.status);
                        
                        //if (v_delivery.status === app.treatments.constant.STATUS_PENDING) {
                   
                            var notification_id = '' + v_delivery.delivery_day + v_delivery.delivery_time; //uniq, for android it must be convert to integer
                            var notification_date = app.date.formatDateToTimestamp(v_delivery.delivery_dt);                       
                            var notification_title = 'Rappel Prise '+v_delivery.display_delivery_time; //Reminder
                            var notification_message = 'Il est temps de prendre vos médicaments!';
                   
                            if (v_delivery.status === app.treatments.constant.STATUS_INPROGRESS && now > notification_date.getTime()) {
                                console.log('Exclude '+notification_id + ' | ' + notification_title);
                                return true;
                            }
                        
                            console.log(notification_id + ' | ' + notification_title);
                            
                            var url_sound = 'sounds/fr_alarm01.mp3';
                            if (objConfig.platform == 'Android') {
                                url_sound = 'file:///android_asset/www/' + url_sound; //file:///android_asset/www/audio/aqua.mp3
                               
                            }
                            url_sound = 'android.resource://' + app_settings.package_id + '/raw/beep';
        
                            cordova.plugins && cordova.plugins.notification.local.schedule({
                                    id: notification_id,
                                    title: notification_title,
                                    text: notification_message,
                                    sound: url_sound,
                                    badge: 1,
                                    data: {'message': 'alert', 'delivery_dt': v_delivery.delivery_dt },
                                    //autoCancel: true,
                                    ongoing: false,
                                    //repeat: 5, // 2 minutes
                                    //icon: 'file:///android_asset/www/img/flower128.png',                               
                                    at: notification_date
                                });
								
								/*
								 window.plugin && window.plugin.notification.local.add({
                                    id: notification_id,
                                    title: notification_title,
                                    message: notification_message,
                                    sound: url_sound,
                                    badge: 1,
                                    json: {'message': 'alert', 'delivery_dt': v_delivery.delivery_dt },
                                    autoCancel: true,
                                    ongoing: false,
                                    //repeat: 5, // 2 minutes
                                    //icon: 'file:///android_asset/www/img/flower128.png',                               
                                    date: notification_date
                                });
								*/
                        //}
    
                     });           
                }       
            }
        });    
                          
        dbAppUserTreatments.set(objUserTreatments);         
  
        //_30_seconds_from_now = app.date.formatDateToTimestamp('2014-08-26 10:00:00');
        //console.log(_30_seconds_from_now.getTime());
         
        /*
        window.plugin.notification.local.add({
            id:      1,
            title:   'Reminder drug 0h',
            message: 'Dont forget your drug',
            //repeat:  'daily',
            //sound:   '/www/res/raw/beep.mp3',
            //sound: 'android.resource://' + app_settings.package_id + '/raw/beep',
            sound:   'TYPE_ALARM',
            //sound: 'TYPE_NOTIFICATION',
            badge: 0,
            json: {'message': 'alert'},
            autoCancel: true,
            //smallIcon: 'ic_dialog_email',
            date:    _30_seconds_from_now
        });

        window.plugin.notification.local.onadd = function (id, state, json) {
            alert('onadd '+id+' state='+state+' '+JSON.stringify(json));
        };
        
        window.plugin.notification.local.ontrigger  = function (id, state, json) {
            alert('ontrigger '+id+' state='+state+' '+JSON.stringify(json));
        };
        
        window.plugin.notification.local.onclick   = function (id, state, json) {
            alert('onclick  '+id+' state='+state+' '+JSON.stringify(json));
        };
        */
    /*
        var url_sound = 'sounds/fr_alarm01.mp3';
    	if (device.platform == 'Android') {
            url_sound = 'file:///android_asset/www/' + url_sound; //file:///android_asset/www/audio/aqua.mp3
            console.log(url_sound);
        }
        url_sound = 'android.resource://' + app_settings.package_id + '/raw/beep';
    
        window.plugin.notification.local.add({
            id:      2,
            title:   'Reminder sound 1',
            message: 'Allo 1',
            sound: url_sound,
            //sound:  'android.resource://' + app_settings.package_id + '/raw/beep',
            //sound: 'beep.wav',
            //sound: 'https://office.eureka-platform.com/assets/media/en_alarm01.mp3',
            //repeat:  'daily',
            //sound:   '/www/res/raw/beep',
           // sound:   '/www/sounds/fr_alarm01.mp3',
            //sound: 'android.resource://' + app_settings.package_id + '/raw/beep',
            //sound:   'TYPE_ALARM',
            badge: 1,
            autoCancel: true,
            //repeat: 2, // 2 minutes
            //icon: 'file:///android_asset/www/img/flower128.png',
            led: 'FFFFFF',
            date:    _60_seconds_from_now
        });
        
          //  var resourceaudio = this.getPhoneGapPath() + 'beep.wav'; //'audio/audio.mp3';
        //console.log(resourceaudio);
        
        
        var _30_seconds_from_now = new Date(now + 30*1000);   
        
        window.plugin.notification.local.add({
            id:      3,
            title:   'Reminder sound 2',
            message: 'Allo 2',
            sound: url_sound,
            //sound:   '/www/audio/beep.mp3',
            //sound: 'https://office.eureka-platform.com/assets/media/en_taking02.mp3',
            //sound: this.getPhoneGapPath() + 'res/raw/beep.mp3',
            //repeat:  'daily',
            //sound:   '/www/res/raw/beep',
           // sound:   '/www/sounds/fr_alarm01.mp3',
            //sound: 'android.resource://' + app_settings.package_id + '/raw/beep',
            //sound:   'TYPE_NOTIFICATION',
            badge: 1,
            autoCancel: true,
            led: 'A0FF05',
            date:    _30_seconds_from_now
        });
       // window.plugin.notification.local.add({ message: 'Great app!' });
       
       */
        /*     
        window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
             alert('Scheduled IDs: ' + scheduledIds.join(' ,'));
        });
        */
        
};

// taking dialog: app.treatments.createPopupDelivery('2014-10-06 10:00:00');
app.treatments.createPopupDelivery = function(delivery_dt) {
    console.log('createPopupDelivery '+delivery_dt);
    //console.log(objUserTreatments);
    var day = delivery_dt.substr(0,10);
    if (objUserTreatments[day]) {
        var delivery_item = objUserTreatments[day].children[delivery_dt];
        //console.log(delivery_item);

        var html_detail = '';
        
        var currentTodayTime = app.date.getTodayTime();
        console.log('currentTodayTime='+currentTodayTime);
        // get today current time                      
        var deliveryT = parseInt(delivery_item.delivery_time,10);  
        
        $.each(delivery_item.children, function(bag_key, bag_item) {                         
                        $.each(bag_item.children, function(drug_key, drug_item) {   
                            var mark;
                            if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_AFTER) mark = '<i class="icon ion-minus" style="color:#6DC4EF"></i>';
                            else if (drug_item.validate_taking == '1') mark = '<i class="icon ion-checkmark" style="color:#9FDDB3"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_BEFORE && drug_item.validate_taking == '0') mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY && drug_item.validate_taking == '0') {
                                                                                                         
                                if (currentTodayTime < deliveryT) {
                                    // is pending
                                    mark = '<i class="icon ion-flag" style="color:#6DC4EF"></i>';
                                } else if (currentTodayTime > (deliveryT + 30)) {
                                    // error
                                    mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                                } else if (currentTodayTime >= deliveryT) {
                                    // in progress
                                    mark = '&nbsp;<i class="icon ion-alert-circled" style="color:#FFA64C"></i>';
                                }                                                                                          
                            }                            
                                                      
                            html_detail += mark+' '+drug_item.drug_name+'<br>';
                      
                        });
        });
        html_detail += '';
                    
        fw7.modal({
            title:  'Prise '+delivery_dt,
            text: i18n.t('treatments.notakingmedication')+'<br><small>'+html_detail+"</small>",
            buttons: [
            /*
              {
                text: 'RAPPEL',
                onClick: function() {
                  fw7.alert('You clicked first button!')
                }
              },
              */
              {
                text: '<i class="icon icon-size24 ion-checkmark-round" style="color:green;"></i> PRENDRE',
                onClick: function() {
                  fw7.alert('You clicked second button!')
                }
              },
              {
                text: '<i class="icon icon-size24 ion-close-round" style="color:red"></i>\nREFUSER',
                bold: true,
                onClick: function() {
                  fw7.alert('You clicked third button!')
                }
              },
            ]
          });
          
         return true; 
    } else {
        // no object, call the server to raise error ?
        return false;
    }
};
    
app.treatments.calculeWidth = function() {
                var width = $(document).width(); //$(window).width();
                var height = $(document).height();
                console.log(width +' x '+ height);
                if (width >= 900) width = 900;
                else width = width * 90 / 100;
                //if (width > 1150) width = 720;
                //else if (width > 700 && width <=1150) width = 450; 
                
                var canvas = $('.pill');
                //var container = $(canvas).parent()
                canvas.css('width', width ); // Max width
                canvas.css('height', width );
                //canvas.attr('height', $(container).height() ) // Max height
                
               return width;
};

app.treatments.respondPill = function() { 
                var width = app.treatments.calculeWidth();                
                var str = app.treatments.renderPill(width);
                $('.pill').html(str);
};
            
app.treatments.renderPill = function(width) {   
            console.log('renderPill width='+width);
            var config = {
                'tl': 'pillbox_quart_full_tl', //'pillbox_quart_empty_tl',
                'tr': 'pillbox_quart_full_tr', //'pillbox_quart_empty_tr',
                'bl': 'pillbox_quart_full_bl', //'pillbox_quart_empty_bl',
                'br': 'pillbox_quart_full_br', 
                'pillbox_quart_width': 441, // 900 = 441 * 2 + 18
                'width_pillbox_base_vert': 18,
                'width_pillbox_base_horiz': 18,
                'width_pillbox_center_logo': 111,
                'width_pillbox_time': 120,   
                'left_position_center_logo': 44,
                'night': 'finaliconnight',
                'morning': 'finaliconmorning',
                'evening': 'finaliconevening',
                'noon': 'finaliconnoon'
            };
                       
            if (info_date.current_section === 'morning') config.tr = 'pillbox_quart_current_tr'; //'pillbox_quart_empty_tr';
            else if (info_date.current_section === 'noon') config.br = 'pillbox_quart_empty_br';
            else if (info_date.current_section === 'evening') config.bl = 'pillbox_quart_empty_bl';
            else if (info_date.current_section === 'night') config.tl = 'pillbox_quart_empty_tl';
            
            /*
            if (width == 450) {
                config.pillbox_quart_width = 220;
                config.width_pillbox_base_vert = 9;
                config.width_pillbox_base_horiz = 9;
                */
            if(width == 900) {
                config.pillbox_quart_width = 441;
                config.width_pillbox_base_vert = 18;
                config.width_pillbox_base_horiz = 18;
                config.width_pillbox_center_logo = 111;
                config.width_pillbox_time = 120;
            } else {
                // 720
                config.pillbox_quart_width = (width / 100) * 49;
                config.width_pillbox_base_vert = (width / 100) * 2; // + 0.01;
                config.width_pillbox_base_horiz = (width / 100) * 2; // + 0.01;
                config.width_pillbox_center_logo = (width / 100) * 14;
                config.left_position_center_logo = 43;
                config.width_pillbox_time = (width / 100) * 10; //8
            }
            
            var height_vertical = width;
            var width_horiz = width;
            // smartphone adjustments
            if (width < 400) {
                height_vertical = width - 1;
            }
            if (width < 300) {
                width_horiz = width - 1;
            }
          
            var colorText = '#11C2BB';
          
            var str = '';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'night\');" border="0" style="position:absolute;top:0;left:0;" ontouchstart="this.src=\'img/ebox/'+config.tl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tl+'_pressed.png\';" src="img/ebox/'+config.tl+'.png">';
            str += '<img width="'+config.width_pillbox_base_vert+'" height="'+height_vertical+'px" border="0" style="position:absolute;top:0;left:'+config.pillbox_quart_width+'px;z-index:2;" src="img/ebox/pillbox_base_vert.png">';
            //str += '<img width="'+config.width_pillbox_base_vert+'" border="0" "style="position:absolute;top:0;left:49%;z-index:2;" src="img/ebox/pillbox_base_vert.png">';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'morning\');" border="0" style="position:absolute;top:0;left:'+(config.pillbox_quart_width + config.width_pillbox_base_vert)+'px;" ontouchstart="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tr+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tr+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" src="img/ebox/'+config.tr+'.png">';
            //str += '<img width="'+config.pillbox_quart_width+'" border="0" style="position:absolute;top:0;left:51%;" ontouchstart="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tr+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tr+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" src="img/ebox/'+config.tr+'.png">';
            str += '<img width="'+width_horiz+'px" height="'+config.width_pillbox_base_horiz+'" border="0" style="position:absolute;top:'+config.pillbox_quart_width+'px;left:0;z-index:2;" src="img/ebox/pillbox_base_horiz.png">';
            //str += '<img height="'+config.width_pillbox_base_horiz+'" border="0" style="position:absolute;top:49%;left:0;z-index:2;" src="img/ebox/pillbox_base_horiz.png">';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'evening\');" border="0" style="position:absolute;top:'+(config.pillbox_quart_width + config.width_pillbox_base_horiz)+'px;left:0;" ontouchstart="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.bl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.bl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" src="img/ebox/'+config.bl+'.png">';
            //str += '<img width="'+config.pillbox_quart_width+'" border="0" style="position:absolute;top:51%;left:0;" ontouchstart="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.bl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.bl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" src="img/ebox/'+config.bl+'.png">';            
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'noon\');" border="0" style="position:absolute;top:'+(config.pillbox_quart_width + config.width_pillbox_base_horiz)+'px;left:'+(config.pillbox_quart_width + config.width_pillbox_base_vert)+'px;" ontouchstart="this.src=\'img/ebox/'+config.br+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.br+'.png\';" onmouseup="this.src=\'img/ebox/'+config.br+'.png\';" onmousedown="this.src=\'img/ebox/'+config.br+'_pressed.png\';" src="img/ebox/'+config.br+'.png">';            
            
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:0;left:0;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.night+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.night+'.png\';" src="img/ebox/'+config.night+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:-20px;left:-10px;z-index:10;">'+calendarTranslate.night+' ('+info_date.label_night_day+')</span>';
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:0;left:93%;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.morning+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.morning+'.png\';" src="img/ebox/'+config.morning+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:-20px;right:-10px;z-index:10;">'+calendarTranslate.morning+'</span>';
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:95%;left:0px;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.evening+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.evening+'.png\';" src="img/ebox/'+config.evening+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:90%;left:-10px;z-index:10;">'+calendarTranslate.evening+'</span>';
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:95%;left:93%;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.noon+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.noon+'.png\';" src="img/ebox/'+config.noon+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:90%;right:-10px;z-index:10;">'+calendarTranslate.noon+'</span>';
            str += '<img width="'+config.width_pillbox_center_logo+'" border="0" style="position:absolute;top:43%;left:'+config.left_position_center_logo+'%;z-index:10;" src="img/ebox/eureka_center_logo_back.png">';
            //document.getElementById("pill").innerHTML = str;
                    
            return str;
            //$('.pill').html(str);
};

app.treatments.viewPill = function(type) {
    var title;
    if (type === 'night') {
        title = info_date.label_next_full + ', 00:00 - 06:00';
    } else if (type === 'noon') {
        title = info_date.label_current_full + ', 12:00 - 18:00';
    } else if (type === 'evening') {
        title = info_date.label_current_full + ', 18:00 - 00:00';
    } else if (type === 'morning') {
        title = info_date.label_current_full + ', 06:00 - 12:00';
    }
    
    var message = i18n.t('treatments.notakingmedication');
    window.plugins && window.plugins.toast.show(message, 'long', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    
	/*
	 window.plugins && window.plugins.toast.show(message, 'long', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});    
	*/
    fw7.addNotification({
                    title: title,
                    message: message, //'Aucun médicament prévu'
                    hold: 2500,
                    additionalClass: 'pill',
                    closeIcon: false,
                    media: '<img width="44" height="44" style="border-radius:100%" src="img/ebox/finaliconnight.png">'
                });
};