import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const trades = [
      { tradeId: 1, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski12345678901234567890', datePublished: '11/10/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 2, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/10/2017', categoryType: 'Electronics', content: 'Explantion for trade' }
      { tradeId: 3, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski12345678901234567890', datePublished: '11/10/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 4, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/10/2017', categoryType: 'Electronics', content: 'Explantion for trade' }
      { tradeId: 5, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski12345678901234567890', datePublished: '11/10/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 6, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/10/2017', categoryType: 'Electronics', content: 'Explantion for trade' }
      { tradeId: 7, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski12345678901234567890', datePublished: '11/10/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 8, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/10/2017', categoryType: 'Electronics', content: 'Explantion for trade' }
      { tradeId: 9, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski12345678901234567890', datePublished: '11/10/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 10, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/10/2017', categoryType: 'Electronics', content: 'Explantion for trade' }
    ];

    const processmessages = [
      {
        id: 'PM0',
        type: 'warning',
        text: 'No message!!!'
      },
      {
        id: 'PMGI',
        type: 'warning',
        text: 'Application could not retrieve the images. Please contact the application administration.'
      },
      {
        id: 'PMNOAs',
        type: 'warning',
        text: 'There are no trades associated with that trader.'
      },
      {
        id: 'PMGAs',
        type: 'error',
        text: 'Application could not retrieve the trades. Please contact the application administration.'
      },
      {
        id: 'PMGA',
        type: 'error',
        text: 'Application could not retrieve the trade. Please contact the application administration.'
      },
      {
        id: 'PMAA',
        type: 'error',
        text: 'Application could not add the new trade. Please contact the application administration.'
      },
      {
        id: 'PMAAS',
        type: 'success',
        text: 'The new trade with the detail below has been added to the apllication store.'
      },
      {
        id: 'PMUA',
        type: 'error',
        text: 'Application could not update the trade. Please contact the application administration.'
      },
      {
        id: 'PMUAS',
        type: 'success',
        text: 'The trade has been updated.'
      },
      {
        id: 'PMRA',
        type: 'error',
        text: 'Application could not remove the trade. Please contact the application administration.'
      },
      {
        id: 'PMRAS',
        type: 'success',
        text: 'The trade and all associated attachements have been removed from the application store!'
      },
      {
        id: 'PMNPAA',
        type: 'warning',
        text: 'You have no privileges to add new trade to the application!'
      },
      {
        id: 'PMNPRA',
        type: 'warning',
        text: 'You have no privileges to remove the trade from the application!'
      },
      {
        id: 'PMNOAUs',
        type: 'warning',
        text: 'There are no traders in the application!'
      },
      {
        id: 'PMGAUs',
        type: 'error',
        text: 'Application could not retrieve the traders. Please contact the application administration.'
      },
      {
        id: 'PMGAU',
        type: 'error',
        text: 'Application could not retrieve the trader. Please contact the application administration.'
      },
      {
        id: 'PMAAU',
        type: 'error',
        text: 'Application could not add the new trader. Please contact the application administration.'
      },
      {
        id: 'PMAAUS',
        type: 'success',
        text: 'The new trader has been added to the application.'
      },
      {
        id: 'PMUAU',
        type: 'error',
        text: 'Application could not update the trader. Please contact the application administration.'
      },
      {
        id: 'PMUAUS',
        type: 'success',
        text: 'The trader has been updated.'
      },
      {
        id: 'PMRAU',
        type: 'error',
        text: 'Application could not remove the trader. Please contact the application administration.'
      },
      {
        id: 'PMRAUS',
        type: 'success',
        text: 'The trader has been removed from the application!'
      },
      {
        id: 'PMNPAAU',
        type: 'warning',
        text: 'You have no privileges to add new trader to the application!'
      },
      {
        id: 'PMNPRAU',
        type: 'warning',
        text: 'You have no privileges to remove the trader from the application!'
      },
      {
        id: 'PMAUE',
        type: 'warning',
        text: 'You have no privileges to remove the trader from the application!'
      },
      {
        id: 'PMNOUs',
        type: 'warning',
        text: 'There are no users in the application!'
      },
      {
        id: 'PMGUs',
        type: 'error',
        text: 'Application could not retrieve the users. Please contact the application administration.'
      },
      {
        id: 'PMGU',
        type: 'error',
        text: 'Application could not retrieve the user. Please contact the application administration.'
      },
      {
        id: 'PMAU',
        type: 'error',
        text: 'Application could not add the new user. Please contact the application administration.'
      },
      {
        id: 'PMAUS',
        type: 'success',
        text: 'The new user has been added to the application!'
      },
      {
        id: 'PMUU',
        type: 'error',
        text: 'Application could not update the user. Please contact the application administration.'
      },
      {
        id: 'PMUUS',
        type: 'success',
        text: 'The user has been updated!'
      },
      {
        id: 'PMRU',
        type: 'error',
        text: 'Application could not remove the user. Please contact the application administration.'
      },
      {
        id: 'PMRUS',
        type: 'success',
        text: 'The user has been removed from the application!'
      },
      {
        id: 'PMNPAU',
        type: 'warning',
        text: 'You have no privileges to add new user to the application!'
      },
      {
        id: 'PMNPRU',
        type: 'warning',
        text: 'You have no privileges to remove the user from the application!'
      }
      {
        id: 'PMNOCs',
        type: 'warning',
        text: 'There are no categories in the application!'
      },
      {
        id: 'PMGCs',
        type: 'еррор',
        text: 'Application could not retriеve the categories. Please contact the application administration.'
      },
      {
        id: 'PMGC',
        type: 'еррор',
        text: 'Application could not retriеve the category. Please contact the application administration.'
      },
      {
        id: 'PMAC',
        type: 'error',
        text: 'Application could not add the new category. Please contact the application administration.'
      },
      {
        id: 'PMACS',
        type: 'success',
        text: 'The category with the details below has been added to the application!'
      },
      {
        id: 'PMUC',
        type: 'error',
        text: 'Application could not update the category. Please contact the application administration.'
      },
      {
        id: 'PMUCS',
        type: 'success',
        text: 'The category has been updated!'
      },
      {
        id: 'PMRC',
        type: 'error',
        text: 'Application could not remove the category. Please contact the application administration.'
      },
      {
        id: 'PMRCS',
        type: 'success',
        text: 'The category has been removed from the application!'
      },
      {
        id: 'PMNPAC',
        type: 'warning',
        text: 'You have no privileges to add new category to the application!'
      },
      {
        id: 'PMNPRC',
        type: 'warning',
        text: 'You have no privileges to remove the category from the application!'
      },
      {
        id: 'PMCE',
        type: 'warning',
        text: 'Category with the details provided already exist in this application!'
      },
      {
        id: 'PMR',
        type: 'error',
        text: 'The application could not finilise your registeration! Please contact the application administration.'
      },
      {
        id: 'PMPNE',
        type: 'error',
        text: 'The password and confirmation password provided do not match.'
      },
      {
        id: 'PMRS',
        type: 'success',
        text: 'You have successfully created an trader application account.'
      },
      {
        id: 'PMRE',
        type: 'error',
        text: 'A user with the email provided already exists.'
      },
      {
        id: 'PML',
        type: 'error',
        text: 'The application could not log you in! Please contact the application administration.'
      },
      {
        id: 'PMLP',
        type: 'warning',
        text: 'The user name or password provided was invalid.'
      },
      {
        id: 'PMUC',
        type: 'warning',
        text: 'The password nust have at least one upper character.'
      },
      {
        id: 'PMPCP',
        type: 'warning',
        text: 'The password and confirmation password do not match.'
      },
      {
        id: 'PMLS',
        type: 'success',
        text: 'You have logged in.'
      },
      {
        id: 'PMG',
        type: 'error',
        text: 'Unexprected error has occured. Please contact the application administration!'
      },
      {
        id: 'PME',
        type: 'error',
        text: ''
      }
    ];

    return {trades, processmessages};
  }
}