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
var config_1 = require('../config');
var Observable_1 = require('rxjs/Observable');
var logger_service_1 = require('./logger.service');
var businesslinesUrl = config_1.CONFIG.baseUrls.businesslines;
var BusinessLineService = (function () {
    function BusinessLineService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
    }
    ;
    //******************************************************
    // GET BUSINESS LINE
    //******************************************************  
    BusinessLineService.prototype.getBusinessLines = function (id) {
        var _this = this;
        return this._http.get(businesslinesUrl)
            .map(function (res) { return res.json(); }) //BusinessLine.fromJSONArrayToPositions(res.json()))
            .catch(function (error) { return _this.onError(error, "GetBusinessLines"); });
    };
    //******************************************************
    // GET BUSINESS LINE
    //****************************************************** 
    BusinessLineService.prototype.getBusinessLine = function (id) {
        var _this = this;
        return this._http.get(businesslinesUrl + "/" + id)
            .map(function (res) { return res.json(); }) // BusinessLine.mapJSONObjectToPosition(res.json()))
            .catch(function (error) { return _this.onError(error, "GetBusinessLine"); });
    };
    //******************************************************
    // ADD BUSINESS LINE
    //******************************************************
    //******************************************************
    // DELETE BUSINESS LINE
    //******************************************************
    //******************************************************
    // UPDATE BUSINESS LINE
    //******************************************************
    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    BusinessLineService.prototype.onError = function (err, method) {
        this._loggerService.logErrors(err, "businessline.service had error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    BusinessLineService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], BusinessLineService);
    return BusinessLineService;
}());
exports.BusinessLineService = BusinessLineService;
//# sourceMappingURL=businessline.service.js.map