"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var logger_service_1 = require('./logger.service');
var HelperService = (function () {
    function HelperService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
    }
    ;
    //******************************************************
    // GET IMAGES
    //******************************************************
    HelperService.prototype.getImages = function () {
        this.localUrl = "http://localhost:3000/app/api/images.json";
        return this._http.get(this.localUrl)
            .map(function (response) { return response.json().data; })
            .catch(this.logError);
    };
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    HelperService.prototype.logError = function (error) {
        this._loggerService.logErrors(error, "article.service");
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    HelperService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], HelperService);
    return HelperService;
}());
exports.HelperService = HelperService;
//# sourceMappingURL=helper.service.js.map