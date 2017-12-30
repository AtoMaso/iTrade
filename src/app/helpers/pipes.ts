﻿// used only when the data pased is object
import { Pipe, PipeTransform } from '@angular/core';
import { Trade, Trader, } from './classes';


// articles pipes
@Pipe({ name: 'SortTradeByTitlePipe'})
class SortTradeByTitlePipe implements PipeTransform {
    transform(value: Trade[], args: any[]) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args[0] === 'A') {
                return value.sort((a: Trade, b: Trade) => {
                    if (a.Title < b.Title) { return -1; }
                    if (a.Title > b.Title) { return 1; }
                    return 0;
                });
            }
            else {
              return value.sort((a: Trade, b: Trade) => {
                    if (a.Title > b.Title) { return -1; }
                    if (a.Title < b.Title) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }
    }
}

@Pipe({ name: 'SortTradeByCategoryPipe' })
class SortTradeByCategoryPipe implements PipeTransform {
  transform(value: Trade[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

              return value.sort((a: Trade, b: Trade) => {
                if (a.CategoryType < b.CategoryType) { return -1; }
                if (a.CategoryType > b.CategoryType) { return 1; }
                    return 0;
                });
            }
            else {

              return value.sort((a: Trade, b: Trade) => {
                if (a.CategoryType > b.CategoryType) { return -1; }
                if (a.CategoryType < b.CategoryType) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'SortTradeByTraderNamePipe' })
class SortTradeByTraderNamePipe implements PipeTransform {
  transform(value: Trade[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

              return value.sort((a: Trade, b: Trade) => {
                if (a.TraderName < b.TraderName) { return -1; }
                if (a.TraderName > b.TraderName) { return 1; }
                    return 0;
                });
            }
            else {

              return value.sort((a: Trade, b: Trade) => {
                if (a.TraderName > b.TraderName) { return -1; }
                if (a.TraderName < b.TraderName) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'SortTradeByDatePipe' })
class SortTradeByDatePipe implements PipeTransform {
  transform(value: Trade[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

              return value.sort((a: Trade, b: Trade) => {
                  if (a.DatePublished < b.DatePublished) { return -1; }
                  if (a.DatePublished > b.DatePublished) { return 1; }
                    return 0;
                });
            }
            else {

              return value.sort((a: Trade, b: Trade) => {
                  if (a.DatePublished > b.DatePublished) { return -1; }
                  if (a.DatePublished < b.DatePublished) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'TopTradesPipe' })
class TopTradesPipe implements PipeTransform {
  transform(value: Trade[], args: any) {

        if (args !== null) {
            return value.slice(0, args);
        }
        else {
            return value.slice(0, 3);
        }
    }
}

// authors pipes
@Pipe({ name: 'SortTradersByNamePipe' })
class SortTradersByNamePipe implements PipeTransform {
    transform(value: Trader[], args: any) {

        if (!value || !value.sort) { return value; }

        return value.sort((a: Trader, b: Trader) => {
            if (a.Name < b.Name) { return -1; }
            if (a.Name > b.Name) { return 1; }
            return 0;
        });
    }
}


// teams pipes


// general pipes
@Pipe({ name: 'InitCaps' })
class InitCapsPipe implements PipeTransform {
    transform(value: string, args: any) {
        return value
            .toLowerCase()
            .replace(/(?:^|\s)[a-z]/g, function (m) {
                return m.toUpperCase();
            });
    }
}

@Pipe({ name: 'Caps' })
class CapsPipe implements PipeTransform {
    transform(value: string, args: any) {
        if (args != null) {
            if (args === 'L') {
                return value.toLowerCase();
            }
            else {
                return value.toUpperCase();
            }
        }
        else {
            // default to upper case with no argument
            return value.toUpperCase();
        }
    }
}

export {

  SortTradeByTitlePipe,    
  SortTradeByCategoryPipe,
  SortTradeByTraderNamePipe,
  SortTradeByDatePipe,
  TopTradesPipe,
  SortTradersByNamePipe,
  InitCapsPipe,
   CapsPipe}
