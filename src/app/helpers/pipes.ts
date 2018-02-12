// used only when the data pased is object
import { Pipe, PipeTransform } from '@angular/core';
import { Trade, TraderDetails, } from './classes';


// articles pipes
@Pipe({ name: 'SortTradesByTitlePipe'})
class SortTradesByTitlePipe implements PipeTransform {
    transform(value: Trade[], args: any[]) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args[0] === 'A') {
                return value.sort((a: Trade, b: Trade) => {
                  if (a.name < b.name) { return -1; }
                  if (a.name > b.name) { return 1; }
                    return 0;
                });
            }
            else {
              return value.sort((a: Trade, b: Trade) => {
                if (a.name > b.name) { return -1; }
                if (a.name < b.name) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }
    }
}

@Pipe({ name: 'SortTradesByCategoryPipe' })
class SortTradesByCategoryPipe implements PipeTransform {
  transform(value: Trade[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

              return value.sort((a: Trade, b: Trade) => {
                if (a.categoryDescription < b.categoryDescription) { return -1; }
                if (a.categoryDescription > b.categoryDescription) { return 1; }
                    return 0;
                });
            }
            else {

              return value.sort((a: Trade, b: Trade) => {
                if (a.categoryDescription > b.categoryDescription) { return -1; }
                if (a.categoryDescription < b.categoryDescription) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'SortTradesByTraderNamePipe' })
class SortTradesByTraderNamePipe implements PipeTransform {
  transform(value: Trade[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

              return value.sort((a: Trade, b: Trade) => {
                if (a.traderLastName < b.traderLastName) { return -1; }
                if (a.traderLastName > b.traderLastName) { return 1; }
                    return 0;
                });
            }
            else {

              return value.sort((a: Trade, b: Trade) => {
                if (a.traderLastName > b.traderLastName) { return -1; }
                if (a.traderLastName < b.traderLastName) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'SortTradesByDatePipe' })
class SortTradesByDatePipe implements PipeTransform {
  transform(value: Trade[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

              return value.sort((a: Trade, b: Trade) => {
                if (a.datePublished < b.datePublished) { return -1; }
                if (a.datePublished > b.datePublished) { return 1; }
                    return 0;
                });
            }
            else {

              return value.sort((a: Trade, b: Trade) => {
                if (a.datePublished > b.datePublished) { return -1; }
                if (a.datePublished < b.datePublished) { return 1; }
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
    transform(value: TraderDetails[], args: any) {

        if (!value || !value.sort) { return value; }

        return value.sort((a: TraderDetails, b: TraderDetails) => {
          if (a.personalDetails.firstName < b.personalDetails.firstName) { return -1; }
          if (a.personalDetails.firstName > b.personalDetails.firstName) { return 1; }
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

  SortTradesByTitlePipe,    
  SortTradesByCategoryPipe,
  SortTradesByTraderNamePipe,
  SortTradesByDatePipe,
  TopTradesPipe,
  SortTradersByNamePipe,
  InitCapsPipe,
   CapsPipe}
