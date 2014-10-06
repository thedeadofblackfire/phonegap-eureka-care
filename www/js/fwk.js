var fwk = {  

    /* ------------- */   
    /* UUID
    /* ------------- */  

    //Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    UUIDv4: function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)},
    
    
	generateGUID: function(){
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	},

	getRandomInt: function(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    
    /* ------------- */   
    /* FAST TEMPLATING (inspired by riotjs) */
    /* ------------- */    
    
    FN: {}, // Precompiled templates (JavaScript functions)
    template_escape: {"\\": "\\\\", "\n": "\\n", "\r": "\\r", "'": "\\'"},
    render_escape:  {'&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;'},

    default_escape_fn: function(str, key) {
      return str == null ? '' : (str+'').replace(/[&\"<>]/g, function(char) {
        return fwk.render_escape[char];
      });
    },

    render: function(tmpl, data, escape_fn) {
      if (escape_fn === true) escape_fn = fwk.default_escape_fn;
      tmpl = tmpl || '';

      return (fwk.FN[tmpl] = fwk.FN[tmpl] || new Function("_", "e", "return '" +
        tmpl.replace(/[\\\n\r']/g, function(char) {
          return fwk.template_escape[char];
        }).replace(/{\s*([\w\.]+)\s*}/g, "' + (e?e(_.$1,'$1'):_.$1||(_.$1==null?'':_.$1)) + '") + "'")
      )(data, escape_fn);
    },
    
    /* ------------- */   
    /* ARRAY [] functions
    /* ------------- */ 
	// http://www.bennadel.com/blog/1796-javascript-array-methods-unshift-shift-push-and-pop.htm
    arrayFindElement: function(array, callback) {        
        for (var i = 0; i < array.length; i++)
            if (callback(array[i])) return array[i];
        return null;
    },
    
    arrayRemoveElement: function(array, callback) {
        for (var i = 0; i < array.length; i++)
            if (callback(array[i])) {
                array.splice(i, 1);
                break;
            }
        return array || [];
    },
	
	//To keep the first x items:
	keepFirstElements: function(array, total) {
		total = total || 10;
		if (array.length > total) return array.splice(total, array.length - total);
		else return array;
		// if (array.length > total) return array = array.slice(0, total);
	},
	
	// To keep the last ten items:
	keepLastElements: function(array, total) {
		total = total || 10;
		console.log('length='+array.length+' total='+total);
		if (array.length > total) array.splice(0, array.length - total);
		return array;
		// if (array.length > total) array = array.slice(-total);
	},

   /* ------------- */   
   /* COLLECTIONS {} functions
   /* ------------- */ 
   // Merge second object into first
   collectionMerge: function (set1, set2){
      for (var key in set2){
        if (set2.hasOwnProperty(key))
          set1[key] = set2[key];
      }
      return set1;
   },
   
        
};
