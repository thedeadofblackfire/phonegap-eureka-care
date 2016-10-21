
// ---------------------
// DATE
// ---------------------
app.date = {};

app.date.month = [];

app.date.calendarTranslate = {};

app.date.initTranslate = function() {
    app.date.month=new Array();
    app.date.month[0]="January";
    app.date.month[1]="February";
    app.date.month[2]="March";
    app.date.month[3]="April";
    app.date.month[4]="May";
    app.date.month[5]="June";
    app.date.month[6]="July";
    app.date.month[7]="August";
    app.date.month[8]="September";
    app.date.month[9]="October";
    app.date.month[10]="November";
    app.date.month[11]="December"; 
        
    app.date.calendarTranslate = {
        monthNames:	["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        today: 'today',
        day: 'day',
        week: 'week',
        month: 'month',   
        treatments: 'Treatments',
        night: 'Night',
        morning: 'Morning',
        noon: 'Noon',
        evening: 'Evening'
    };    
	
    if (baseLanguage === 'fr') {      
        app.date.calendarTranslate.monthNames =	['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
		app.date.calendarTranslate.monthNamesShort = ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'];
		app.date.calendarTranslate.dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
		app.date.calendarTranslate.dayNamesShort = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
       
        app.date.calendarTranslate.today = 'aujourd\'hui';
		app.date.calendarTranslate.day = 'jour';
		app.date.calendarTranslate.week = 'semaine';
		app.date.calendarTranslate.month = 'mois';
 
        app.date.calendarTranslate.treatments = 'Traitements';
        app.date.calendarTranslate.night = 'Nuit';
        app.date.calendarTranslate.morning = 'Matin';
        app.date.calendarTranslate.noon = 'Midi';
        app.date.calendarTranslate.evening = 'Soir';
            
        app.date.month[0]="Janvier";
        app.date.month[1]="Février";
        app.date.month[2]="Mars";
        app.date.month[3]="Avril";
        app.date.month[4]="Mai";
        app.date.month[5]="Juin";
        app.date.month[6]="Juillet";
        app.date.month[7]="Août";
        app.date.month[8]="Septembre";
        app.date.month[9]="Octobre";
        app.date.month[10]="Novembre";
        app.date.month[11]="Décembre";                                 
    }
};

//2013-06-03 08:00:00
app.date.formatDateToTimestamp = function(d) {
    //new Date().getTime()
    //(year, month, day, hours, minutes, seconds, milliseconds)    
    //console.log(parseInt(d.substr(0,4)) + ' '+(parseInt(d.substr(5,2)) - 1) + ' '+parseInt(d.substr(8,2))  );
    
    //console.log(d + ' ' + parseInt(d.substr(11,2)) + ' ' + parseInt(d.substr(17,2)));
                
    var current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(5,2)) - 1), parseInt(d.substr(8,2)), parseInt(d.substr(11,2)), parseInt(d.substr(14,2)), parseInt(d.substr(17,2)) );
    //console.log(current.getTime());   
	return current;    
};

//2013-06-03 or 2013-06-03 08:00:00 or 20140929 to label
app.date.formatDateToLabel = function(d) {
    var current;
    if (d.length == 8) current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(4,2)) - 1), parseInt(d.substr(6,2)), 0, 0, 0); 
    else if (d.length == 10) current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(5,2)) - 1), parseInt(d.substr(8,2)), 0, 0, 0 );
    else current = app.date.formatDateToTimestamp(d);
    var dd = current.getDate().toString();
    var str = calendarTranslate.dayNames[current.getDay()]+' '+(dd[1]?dd:"0"+dd[0])+' '+calendarTranslate.monthNames[current.getMonth()];
    return str;
};

app.date.formatyyyymmdd = function(d) {         
    var yyyy = d.getFullYear().toString();                                    
    var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based         
    var dd  = d.getDate().toString();             
                            
    return '' + yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
    //return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

app.date.getTodayTime = function() {
	// get today current time
    var d = new Date();
    var ho = ''+d.getHours();
    if (ho.length == 1) ho = '0'+ho;   
    var mi = ''+d.getMinutes();
    if (mi.length == 1) mi = '0'+mi;  
    var currentTodayTime = parseInt(ho + mi,10);    
    return currentTodayTime;
};

// convert 20140526 to a prev next object string
app.date.formatDateToObject = function(d) {
    var info = {};      
    var today = new Date();
    info.str_today = app.date.formatyyyymmdd(today);
    
    var hh  = today.getHours().toString();  
    var mm  = today.getMinutes().toString();           
                            
    info.str_time = '' + (hh[1]?hh:"0"+hh[0]) + (mm[1]?mm:"0"+mm[0]);
    
    var current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(4,2)) - 1), parseInt(d.substr(6,2)) );
    info.current = current.getTime();
    info.str_current = d; 
    //var next = current;
    var next = new Date(current.getTime());
    next = new Date(next.setDate(next.getDate() + 1));
    info.next = next.getTime();
    info.str_next = app.date.formatyyyymmdd(next);

    // var prev = current;
    var prev = new Date(current.getTime());
    prev = new Date(prev.setDate(prev.getDate() - 1));
    info.prev = prev.getTime();
    info.str_prev = app.date.formatyyyymmdd(prev);
           
    // label
    var dd = current.getDate().toString();
    info.label_night_day = (next.getDate().toString()[1]?next.getDate().toString():"0"+next.getDate().toString()[0]);
    info.label_current_day = calendarTranslate.dayNamesShort[current.getDay()];
  
    info.current_section = 'archive';
    if (d === info.str_today) {        
        info.label_current_day = calendarTranslate.today.toUpperCase()+', '+ info.label_current_day;
        
        // morning: 0600 - 1200, noon (12 - 18), evening (18 - 00), night (00 - 06)
        var time = parseInt(info.str_time, 10);
        info.time = time;
        if (time >= 0 && time < 600) info.current_section = 'night';
        else if (time >= 600 && time < 1200) info.current_section = 'morning';
        else if (time >= 1200 && time < 1800) info.current_section = 'noon';
        else if (time >= 1800 && time < 2400) info.current_section = 'evening';
    }
    if (baseLanguage === 'fr') {        
        info.label_current = (dd[1]?dd:"0"+dd[0])+' '+calendarTranslate.monthNamesShort[current.getMonth()];       
        info.label_current_full = calendarTranslate.dayNamesShort[current.getDay()] + ' ' + info.label_current;
        info.label_next_full = calendarTranslate.dayNamesShort[next.getDay()] + ' ' + (next.getDate().toString()[1]?next.getDate().toString():"0"+next.getDate().toString()[0]) + ' ' + calendarTranslate.monthNamesShort[next.getMonth()];
        info.label_prev_full = calendarTranslate.dayNamesShort[prev.getDay()] + ' ' + (prev.getDate().toString()[1]?prev.getDate().toString():"0"+prev.getDate().toString()[0]) + ' ' + calendarTranslate.monthNamesShort[prev.getMonth()];
       // info.label_next_day = (dd[1]?dd:"0"+dd[0])+' '+calendarTranslate.monthNamesShort[next.getMonth()];
        //info.label_next_day = next.getDate().toString()+' '+calendarTranslate.monthNamesShort[next.getMonth()];
    } else {
        info.label_current = calendarTranslate.monthNamesShort[current.getMonth()]+', '+(dd[1]?dd:"0"+dd[0]);
        //info.label_next_day = calendarTranslate.monthNamesShort[next.getMonth()]+', '+next.getDate().toString();
        info.label_current_full = calendarTranslate.dayNamesShort[current.getDay()] + ' ' + info.label_current;
        info.label_next_full = calendarTranslate.dayNamesShort[next.getDay()] + ' ' + calendarTranslate.monthNamesShort[next.getMonth()] + ', '+(next.getDate().toString()[1]?next.getDate().toString():"0"+next.getDate().toString()[0]);
        info.label_prev_full = calendarTranslate.dayNamesShort[prev.getDay()] + ' ' + calendarTranslate.monthNamesShort[prev.getMonth()] + ', '+(prev.getDate().toString()[1]?prev.getDate().toString():"0"+prev.getDate().toString()[0]);      
    }    
  
    console.log(info);
	return info;    
};

app.date.generateProcessingId = function() {
    var d = new Date();
    return d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
};