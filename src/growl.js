angular.module('ui.growl', ['template/growl/box.html'])

.controller('GrowlController', ['$scope', '$timeout', 'growl', 'model', function($scope, $timeout, growl, model) {
    var currentTimeout;

    $scope.title = model.title;
    $scope.text = model.text;
    $scope.options = model.options;
    $scope.interval = model.options.timeout;

    $scope.showclass = $scope.options.class;

    $scope.close = function(res) {
        growl.close(res);
    };

    if ($scope.options.sticky === false) {
        $scope.$watch('interval', restartTimer);
    }

    function restartTimer() {

        if (currentTimeout) {
            $timeout.cancel(currentTimeout);
        }

        function go() {
            growl.close();
        }

        var interval = +$scope.interval;
        if (!isNaN(interval) && interval >= 0) {
            currentTimeout = $timeout(go, interval);
        }
    }

}])

.provider("$growl", function() {

    // The default options for all growls.
    var defaults = {
        class: 'inverse',
        sticky: false,
        timeout: 2500
    };

    /*
         Returns the actual `$growl` service that is injected in controllers
    */
    this.$get = ["$http", "$document", "$compile", "$rootScope", "$controller", "$templateCache", "$q", "$injector", function($http, $document, $compile, $rootScope, $controller, $templateCache, $q, $injector) {

        var body = $document.find('body');

        function createElement(clazz) {
            var el = angular.element("<div>");
            el.addClass(clazz);
            return el;
        }

        function Growl(opts) {
            var self = this,
            options = this.options = angular.extend({},
            defaults, opts);

            var el = document.querySelector('.growl-notice-wrapper');
            if (!el || el.length === 0) {
                this.containerEl = createElement("growl-notice-wrapper");
                self._addElementsToDom();
            }
            else {
                this.containerEl = angular.element(el);
            }
            this.growlEl = createElement();

        }

        // The `open(templateUrl, controller)` method opens the growl.
        // Use the `templateUrl` and `controller` arguments if specifying them at dialog creation time is not desired.
        Growl.prototype.open = function(templateUrl, controller) {
            var self = this,
            options = this.options;

            if (templateUrl) {
                options.templateUrl = templateUrl;
            }
            if (controller) {
                options.controller = controller;
            }

            this._loadResolves().then(function(locals) {
                var $scope = locals.$scope = self.$scope = locals.$scope ? locals.$scope : $rootScope.$new();

                self.growlEl.html(locals.$template);

                if (self.options.controller) {
                    var ctrl = $controller(self.options.controller, locals);
                    //self.modalEl.children().data('ngControllerController', ctrl);
                }

                $compile(self.growlEl)($scope);
                self._addElementsToContainer();
            });

            this.deferred = $q.defer();
            return this.deferred.promise;
        };

        // closes the growl and resolves the promise returned by the `open` method with the specified result.
        Growl.prototype.close = function(result) {
            var self = this;

            this._onCloseComplete(result);

        };

        Growl.prototype._onCloseComplete = function(result) {
            this._removeElementsFromContainer();
            this.deferred.resolve(result);
        };

        Growl.prototype._addElementsToContainer = function() {
            this.containerEl.append(this.growlEl);
        };

        Growl.prototype._removeElementsFromContainer = function() {
            this._fade();
        };

        Growl.prototype._addElementsToDom = function() {
            body.append(this.containerEl);
        };

        Growl.prototype._removeElementsFromDom = function() {
            this.containerEl.empty();
        };

        Growl.prototype._fade = function(params) {
            var self = this;
            var e = this.growlEl;

            params = params || {};
            var fade = (typeof(params.fade) != 'undefined') ? params.fade : true;
            var fade_out_speed = params.speed || this.fade_out_speed;

            if (fade && e.animate) {
                e.animate({
                    opacity: 0
                },
                fade_out_speed, function() {
                    e.animate({
                        height: 0
                    },
                    300, function() {
                        self.growlEl.remove();
                    });
                });
            }
            else {
                this.growlEl.remove();
            }

        };

        // Loads all `options.resolve` members to be used as locals for the controller associated with the growl.
        Growl.prototype._loadResolves = function() {
            var values = [],
            keys = [],
            templatePromise,
            self = this;

            if (this.options.template) {
                templatePromise = $q.when(this.options.template);
            } else if (this.options.templateUrl) {
                templatePromise = $http.get(this.options.templateUrl, {
                    cache: $templateCache
                }).then(function(response) {
                    return response.data;
                });
            }

            angular.forEach(this.options.resolve || [], function(value, key) {
                keys.push(key);
                values.push(angular.isString(value) ? $injector.get(value) : $injector.invoke(value));
            });

            keys.push('$template');
            values.push(templatePromise);

            return $q.all(values).then(function(values) {
                var locals = {};
                angular.forEach(values, function(value, index) {
                    locals[keys[index]] = value;
                });
                locals.growl = self;
                return locals;
            });
        };

        /*
            The actual `$growl` service that is injected in controllers.
        */
        return {
            // Creates a new `Growl` with the specified options.
            growl: function(opts) {
                return new Growl(opts);
            },

            // creates a new `Growl` tied to the default box template and controller.
            //
            // * `result`: the result to pass to the `close` method of the dialog when the button is clicked
            // * `label`: the label of the button
            // * `cssClass`: additional css class(es) to apply to the button for styling
            box: function(title, text, options) {
                title = title || "";
                text = text || "";
                options = options || {};

                options = angular.extend(defaults, options);

                if (text.length === 0 && title.length === 0) {
                    throw new Error('Growl Open requires a title or a text (or both)');
                }

                return new Growl({
                    templateUrl: 'template/growl/box.html',
                    controller: 'GrowlController',
                    resolve: {
                        model: function() {
                            return {
                                title: title,
                                text: text,
                                options: options
                            };
                        }
                    }
                });
            }
        };
    }];
});

angular.module("template/growl/box.html", []).run(["$templateCache", function($templateCache) {

    $templateCache.put("template/growl/box.html",

    "<div class=\"growl-item-wrapper {{showclass}}\" style=\"\"> \n" + "  <div class=\"growl-item\"> \n" + "    <div class=\"growl-close\" ng-click=\"close()\">&times;</div> \n" + "    <div> \n" + "      <b ng-show=\"(title.length > 0 )\">{{title}}</b> \n" + "      <p>{{text}}</p> \n" + "    </div> \n" + "    <div style=\"clear:both\"></div> \n" + "  </div> \n" + "</div> \n" +

    "");

}]);