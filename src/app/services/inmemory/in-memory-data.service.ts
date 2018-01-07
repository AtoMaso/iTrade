import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const trades = [
      { tradeId: 1, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski123456789', datePublished: '11/02/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 2, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/01/2017', categoryType: 'Electronics', content: 'Explantion for trade' },
      { tradeId: 1, title: 'Baloon for coffee table sdsadsdsd', traderId: 1, traderName: 'Mirko Srbinovski123456789', datePublished: '11/02/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 3, title: 'Baloon for coffee table', traderId: 1, traderName: 'Nenad Srbinovski', datePublished: '11/10/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 4, title: 'TV for a push bike adadadadada', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/09/2017', categoryType: 'Electronics', content: 'Explantion for trade' },
      { tradeId: 5, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski123456789', datePublished: '11/08/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 6, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/07/2017', categoryType: 'Electronics', content: 'Explantion for trade' },
      { tradeId: 7, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski123456789', datePublished: '11/06/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 8, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/05/2017', categoryType: 'Electronics', content: 'Explantion for trade' },
      { tradeId: 9, title: 'Baloon for coffee table', traderId: 1, traderName: 'Mirko Srbinovski123456789', datePublished: '11/04/2017', categoryType: 'Toy', content: 'Explantion for trade' },
      { tradeId: 10, title: 'TV for a push bike', traderId: 2, traderName: 'Nenad Srbinovski', datePublished: '11/03/2017', categoryType: 'Electronics', content: 'Explantion for trade' }
    ];
   
    const images = [
      { imageId:1, tradeId: 1, title: '1', url: 'assets/images/1.jpg' },
      { imageId:2, tradeId: 1, title: '2', url: 'assets/images/2.jpg' },
      { imageId: 3, tradeId: 1, title: '3', url: 'assets/images/3.jpg' },

      { imageId:4, tradeId: 2, title: '4', url: 'assets/images/4.jpg' },
      { imageId:5, tradeId: 2, title: '5', url: 'assets/images/5.jpg' },
      { imageId: 6, tradeId: 2, title: '6', url: 'assets/images/6.jpg' },

      { imageId:7, tradeId: 3, title: '7', url: 'assets/images/7.jpg' },
      { imageId:8, tradeId: 3, title: '8', url: 'assets/images/8.jpg' },
      { imageId: 9, tradeId: 3, title: '9', url: 'assets/images/9.jpg' },

      { imageId:10, tradeId: 4, title: '10', url: 'assets/images/10.jpg' },
      { imageId:11, tradeId: 4, title: '11', url: 'assets/images/11.jpg' },
      { imageId: 12, tradeId: 4, title: '12', url: 'assets/images/12.jpg' },

      { imageId:13, tradeId: 5, title: '13', url: 'assets/images/13.jpg' },
      { imageId:14, tradeId: 5, title: '14', url: 'assets/images/14.jpg' },
      { imageId: 15, tradeId: 5, title: '15', url: 'assets/images/15.jpg' },

      { imageId:16, tradeId:6, title: '16', url: 'assets/images/16.jpg' },
      { imageId:17, tradeId: 6, title: '17', url: 'assets/images/17.jpg' },
      { imageId: 18, tradeId: 6, title: '18', url: 'assets/images/18.jpg' },

      { imageId:19, tradeId: 7, title: '19', url: 'assets/images/19.jpg' },
      { imageId:20, tradeId: 7, title: '20', url: 'assets/images/20.jpg' },
      { imageId: 21, tradeId: 7, title: '21', url: 'assets/images/21.jpg' },

      { imageId:22, tradeId: 8, title: '22', url: 'assets/images/22.jpg' },
      { imageId:23, tradeId: 8, title: '23', url: 'assets/images/23.jpg' },
      { imageId: 24, tradeId: 8, title: '24', url: 'assets/images/24.jpg' },

      { imageId: 25, tradeId: 9, title: '25', url: 'assets/images/25.jpg' },
      { imageId: 50, tradeId: 9, title: '50', url: 'assets/images/50.jpg' },
       { imageId: 51, tradeId: 9, title: '51', url: 'assets/images/50.jpg' },

      { imageId:26, tradeId: 10, title: '26', url: 'assets/images/26.jpg' },
      { imageId:27, tradeId: 10, title: '27', url: 'assets/images/27.jpg' },
      { imageId: 28, tradeId: 10, title: '28', url: 'assets/images/28.jpg' },

      { imageId:29, tradeId: 11, title: '29', url: 'assets/images/29.jpg' },
      { imageId:30, tradeId: 11, title: '30', url: 'assets/images/30.jpg' },
      { imageId: 31, tradeId: 11, title: '31', url: 'assets/images/31.jpg' },

      { imageId:32, tradeId: 12, title: '32', url: 'assets/images/32.jpg' },
      { imageId:33, tradeId: 12, title: '33', url: 'assets/images/33.jpg' },
      { imageId: 34, tradeId: 12, title: '34', url: 'assets/images/34.jpg' },

      { imageId:35, tradeId: 13, title: '35', url: 'assets/images/35.jpg' },
      { imageId:36, tradeId: 13, title: '36', url: 'assets/images/36.jpg' },
      { imageId: 37, tradeId: 13, title: '37', url: 'assets/images/37.jpg' },

      { imageId:38, tradeId: 14, title: '38', url: 'assets/images/38.jpg' },
      { imageId:39, tradeId: 14, title: '39', url: 'assets/images/39.jpg' },
      { imageId: 40, tradeId: 14, title: '40', url: 'assets/images/40.jpg' },

      { imageId:41, tradeId: 15, title: '41', url: 'assets/images/41.jpg' },
      { imageId:42, tradeId: 15, title: '42', url: 'assets/images/42.jpg' },
      { imageId: 43, tradeId: 15, title: '43', url: 'assets/images/43.jpg' },

      { imageId:44, tradeId: 16, title: '44', url: 'assets/images/44.jpg' },
      { imageId:45, tradeId: 16, title: '45', url: 'assets/images/45.jpg' },
      { imageId: 46, tradeId: 16, title: '46', url: 'assets/images/46.jpg' },

      { imageId:47, tradeId: 17, title: '47', url: 'assets/images/47.jpg' },
      { imageId:48, tradeId: 17, title: '48', url: 'assets/images/48.jpg' },
      { imageId: 49, tradeId: 17, title: '49', url: 'assets/images/49.jpg' },

     
    ];

    const processmessages = [
      { id: 'PM0', type: 'warning', text: 'No message!!!' },
      { id: 'PMGI', type: 'warning', text: 'Application could not retrieve the images. Please contact the application administration.' },
      { id: 'PMNOTs', type: 'warning', text: 'There are no trades associated with that trader.' },
      { id: 'PMGTs', type: 'error', text: 'Application could not retrieve the trades. Please contact the application administration.' },
      { id: 'PMGT', type: 'error', text: 'Application could not retrieve the trade. Please contact the application administration.' },
      { id: 'PMAT', type: 'error', text: 'Application could not add the new trade. Please contact the application administration.' },
      { id: 'PMATS', type: 'success', text: 'The new trade with the detail below has been added to the apllication store.' },
      { id: 'PMUA', type: 'error', text: 'Application could not update the trade. Please contact the application administration.' },
      { id: 'PMUTS', type: 'success', text: 'The trade has been updated.' },
      { id: 'PMRT', type: 'error', text: 'Application could not remove the trade. Please contact the application administration.' },
      { id: 'PMRTS', type: 'success', text: 'The trade and all associated attachements have been removed from the application store!' },
      { id: 'PMNPAT', type: 'warning', text: 'You have no privileges to add new trade to the application!' },
      { id: 'PMNPRT', type: 'warning', text: 'You have no privileges to remove the trade from the application!' },
      { id: 'PMNOTUs', type: 'warning', text: 'There are no traders in the application!' },
      { id: 'PMGTUs', type: 'error', text: 'Application could not retrieve the traders. Please contact the application administration.' },
      { id: 'PMGTU', type: 'error', text: 'Application could not retrieve the trader. Please contact the application administration.' },
      { id: 'PMATU', type: 'error', text: 'Application could not add the new trader. Please contact the application administration.' },
      { id: 'PMATUS', type: 'success', text: 'The new trader has been added to the application.' },
      { id: 'PMUTU', type: 'error', text: 'Application could not update the trader. Please contact the application administration.' },
      { id: 'PMUTUS', type: 'success', text: 'The trader has been updated.' },
      { id: 'PMRTU', type: 'error', text: 'Application could not remove the trader. Please contact the application administration.' },
      { id: 'PMRAUS', type: 'success', text: 'The trader has been removed from the application!' },
      { id: 'PMNPAAU', type: 'warning', text: 'You have no privileges to add new trader to the application!' },
      { id: 'PMNPRAU', type: 'warning', text: 'You have no privileges to remove the trader from the application!' },
      { id: 'PMAUE', type: 'warning', text: 'You have no privileges to remove the trader from the application!' },
      { id: 'PMNOUs', type: 'warning', text: 'There are no users in the application!' },
      { id: 'PMGUs', type: 'error', text: 'Application could not retrieve the users. Please contact the application administration.' },
      { id: 'PMGU', type: 'error', text: 'Application could not retrieve the user. Please contact the application administration.' },
      { id: 'PMAU', type: 'error', text: 'Application could not add the new user. Please contact the application administration.' },
      { id: 'PMAUS', type: 'success', text: 'The new user has been added to the application!' },
      { id: 'PMUU', type: 'error', text: 'Application could not update the user. Please contact the application administration.' },
      { id: 'PMUUS', type: 'success', text: 'The user has been updated!' },
      { id: 'PMRU', type: 'error', text: 'Application could not remove the user. Please contact the application administration.' },
      { id: 'PMRUS', type: 'success', text: 'The user has been removed from the application!' },
      { id: 'PMNPAU', type: 'warning', text: 'You have no privileges to add new user to the application!' },
      { id: 'PMNPRU', type: 'warning', text: 'You have no privileges to remove the user from the application!' },
      { id: 'PMNOCs', type: 'warning', text: 'There are no categories in the application!' },
      { id: 'PMGCs', type: 'еррор', text: 'Application could not retriеve the categories. Please contact the application administration.' },
      { id: 'PMGC', type: 'еррор', text: 'Application could not retriеve the category. Please contact the application administration.' },
      { id: 'PMAC', type: 'error', text: 'Application could not add the new category. Please contact the application administration.' },
      { id: 'PMACS', type: 'success', text: 'The category with the details below has been added to the application!' },
      { id: 'PMUC', type: 'error', text: 'Application could not update the category. Please contact the application administration.' },
      { id: 'PMUCS', type: 'success', text: 'The category has been updated!' },
      { id: 'PMRC', type: 'error', text: 'Application could not remove the category. Please contact the application administration.' },
      { id: 'PMRCS', type: 'success', text: 'The category has been removed from the application!' },
      { id: 'PMNPAC', type: 'warning', text: 'You have no privileges to add new category to the application!' },
      { id: 'PMNPRC', type: 'warning', text: 'You have no privileges to remove the category from the application!' },
      { id: 'PMCE', type: 'warning', text: 'Category with the details provided already exist in this application!' },
      { id: 'PMR', type: 'error', text: 'The application could not finilise your registeration! Please contact the application administration.' },
      { id: 'PMPNE', type: 'error', text: 'The password and confirmation password provided do not match.' },
      { id: 'PMRS', type: 'success', text: 'You have successfully created an trader application account.' },
      { id: 'PMRE', type: 'error', text: 'A user with the email provided already exists.' },
      { id: 'PML', type: 'error', text: 'The application could not log you in! Please contact the application administration.' },
      { id: 'PMLP', type: 'warning', text: 'The user name or password provided was invalid.' },
      { id: 'PMUC', type: 'warning', text: 'The password nust have at least one upper character.' },
      { id: 'PMPCP', type: 'warning', text: 'The password and confirmation password do not match.' },
      { id: 'PMLS', type: 'success', text: 'You have logged in.' },
      { id: 'PMG', type: 'error', text: 'Unexprected error has occured. Please contact the application administration!' },
      { id: 'PME', type: 'error', text: '' }
    ];

    return {trades, processmessages, images };
  }
}