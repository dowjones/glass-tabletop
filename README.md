#[Glass-Tabletop](https://github.com/dowjones/glass-tabletop)
##Tabletop.js + Memory-Cache

##Introduction
A simple interface for dealing with Google Spreadsheets. By allowing for a single sheet to be requested per call, provides a much cleaner data structure from the non-simpleSheet response of [Tabletop.js](https://github.com/jsoma/tabletop), by removing unnecessary hierarchy and raw data access. Ask for a table, get its rows, and have that request be cached for a configurable amount of time.


##Installation
To use this repo from within the dowjones github, include the following in your package.json dependencies:
```javascript
npm install glass-tabletop

```

##Prototype
collection.get(_tableName_,_(optional) iterator_, _callback_);
* `tableName` String that maps to the name of a table in the configured google spreadsheet
* `iterator(array, callback)` Optional function for manipulating results, before they're cached, provides an array of rows from the spreadsheet, with a callback to call upon completion that accepts the array as a parameter, `callback(err, array)`
* `callback(err, array)` Final callback for handling cached, processed results


##Simple Usage
A very straightforward example, configured with a public spreadsheet ID, 10-second cache timeout, and outputs the list of articles to the console.

**Note:** because this library uses tabletop.js under the hood, any spreadsheet used needs to be published to the web, as per their [instructions for getting your data out there](https://github.com/jsoma/tabletop#1-getting-your-data-out-there), before it will work with this library.
```javascript

var collection = require('glass-tabletop');

collection.config({
  spreadsheet_id:"1ZwRD7OimsQ5w-ylcm5EZ1pl68rzVwUs_m6NRntzPS1o",
  cache_timeout:10000
});

collection.get("articles",function(err, list){
  console.log(list)
})
```
The response in this example shows the `articles` tab from the linked [Google Spreadsheet](https://docs.google.com/a/wsj.com/spreadsheets/d/1ZwRD7OimsQ5w-ylcm5EZ1pl68rzVwUs_m6NRntzPS1o).
```javascript
[
  {
    link: "http://wsj.com",
    metadata: "WSJ Homepage"
  },
  {
    link: "http://barrons.com",
    metadata: "Barron's Homepage",
  },
  {
    link: "http://marketwatch.com",
    metadata: "Marketwatch's Homepage",
  }
]
```


##More Advanced Usage
Using the optional 2nd parameter to clean up the results by removing unnecessary keys, adds in unique properties, and the continues the processing of them to the final function.
```javascript
var collection = require('glass-tabletop');

collection.config({
  spreadsheet_id:"1ZwRD7OimsQ5w-ylcm5EZ1pl68rzVwUs_m6NRntzPS1o",
  cache_timeout:10000,
  debug:true //adds verbose console.log output of actions taken by the library
});

collection.get("articles", function(err, list, callback){
  for(i in list) {
    list[i].random = Math.random();
    delete list[i].rowNumber;
  }
  callback(list);
}, function(err, list){
  console.log(list)
});

```
