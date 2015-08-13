var tabletop = require('tabletop'),
    cache = require('memory-cache');

var collection = {
  settings : {
    _spreadsheet_id:(process.env.CRAPSHOOT_SPREADSHEET_ID) ? process.env.CRAPSHOOT_SPREADSHEET_ID : null,
    _cache_timeout:(process.env.CRAPSHOOT_CACHE_TIMEOUT) ? process.env.CRAPSHOOT_CACHE_TIMEOUT : 60000,
    _debug:false
  },
  config: function(config) {
    for (i in Object.keys(config)) {
      this.settings['_'+Object.keys(config)[i]] = config[Object.keys(config)[i]];
    };
  },
  get:function(table, process, callback) {
    if(callback == undefined){callback = process; process = null;}

    var parent = this;
    var cacheKey = parent.settings._spreadsheet_id + '__' + table;
    if(cache.get(cacheKey) == null) {
      tabletop.init({
        key: parent.settings._spreadsheet_id,
        callback: function(data){
          var items = data[table].elements;
          if(parent.settings._debug) console.log(table + " not found in the cache, cached");
          if(process != null) {
            process(null, items, function(items){
              if(parent.settings._debug) console.log("process fired")
              cache.put(cacheKey, JSON.stringify(items), parent.settings._cache_timeout);
              callback(null, items);
            })
          } else {
            if(parent.settings._debug) console.log("process didn't fire")
            cache.put(cacheKey, JSON.stringify(items), parent.settings._cache_timeout);
            callback(null, items);
          }
        },
        simpleSheet: false
      });
    } else {
      if(parent.settings._debug) console.log(table + " served from the cache");
      callback(null, JSON.parse(cache.get(cacheKey)));
    }
  }
};

module.exports = collection;
