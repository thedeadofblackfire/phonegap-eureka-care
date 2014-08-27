var fwkStore = {  

    /* ------------- */   
    /* LOCAL STORAGE */
    /* ------------- */    
    
    /*
    var dbAppUser = dbAppUser || fwkStore.DB("app_user");
    var objUser = {};
    objUser = dbAppUser.get();
    dbAppUser.set(res.user);
    dbAppUser.remove();
    */
    DB : function(key) {
       var store = window.localStorage;
       return {
          get: function() {
             //window.localStorage.getItem('user_lat');
             return JSON.parse(store[key] || '{}');   
          },
          set: function(data) {
             store[key] = JSON.stringify(data);
             //window.localStorage.setItem('user_lat', LatitudeCarteClick);
             //window.sessionStorage.setItem('user', JSON.stringify(res.user));
          },
          remove: function() {
             store.removeItem(key);
          },
          empty: function() {
            if (Object.keys(this.get()).length == 0) return true;
            else return false;
          }
       }
    },
    
    // inspired https://github.com/marcuswestin/store.js/blob/master/store.js
    store : function() {
       var storage = window.localStorage;
       return {          
          get: function(key) {
             return JSON.parse(storage[key] || '{}');   
             //storage.getItem(key)
          },          
          set: function(key, data) {
             storage[key] = JSON.stringify(data);
          },
          remove: function(key) {
             storage.removeItem(key);
          },
          clear: function() {
            storage.clear();
          },
          empty: function(key) {
            if (Object.keys(this.get(key)).length == 0) return true;
            else return false;
          }
       }
    },

};
