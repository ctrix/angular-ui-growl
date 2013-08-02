Angular-UI-Growl
================

**Growl style notifications in AngularJS**

Demo
====

If you want to have a look at what this code does, click [here](http://ctrix.github.io/angular-ui-growl/)

Dependencies
============

Angular-UI-Growl depends only on AngularJS 1.0.X or 1.1.X. Versions up to 1.0.7 and 1.1.5 has been tested.

If you will use JQuery, which is not mandatory, the fading effect will be animated.

Installation
============

* Using bower and running `bower install angular-ui-growl`
* Downloading it manually by clicking [here](https://github.com/ctrix/angular-ui-growl/archive/master.zip)


Quick configuration
===================

````javascript
angular.module('demoApp', [ 'ui.growl' ])
  .config(function ($routeProvider) {
    /* Your code here */
});

angular.module('demoAppModule')
.controller('MainCtrl', function ($scope, $growl) {
    $scope.doClick = function(stick) {
        $growl.box('Hello', 'UI.Growl in action', {
            class: 'success',
            sticky: stick
        }).open();
    };
});

````

Using ui.growl
==============

Growl is invoked like this:

````javascript
    $growl.box('Hello', 'UI.Growl in action', {
            class: 'success',
            sticky: false,
            timeout: 2500
    }).open();
````
In particular:

* The first argument to the box() function is the title of the notification.
* The second argument of the box() function is the notification text.
* The third argument are the options.

At the moment you can specify 3 options:

* `sticky` parameters specify if the notification box should automatically disappear after `timeout` millisecond. Default `false`
* `timeout` is the interval, in milliseconds, before fading out a non sticky notification. Default is `2500`
* `class` indicates the CSS class of the notification box. See the *less* file for to build your own or change the existent.


*Don't forget to include* the .css file in your HTML or the .less file if you're using bootstrap.


License
=======

The MIT License (MIT)

Copyright (c) 2013 Massimo Cetra

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


Author
======

Massimo Cetra (@_ctrix_)

