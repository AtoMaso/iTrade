import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { CategoryService } from '../../services/categories/category.service';
import { SubcategoriesService } from '../../services/subcategories/subcategories.service';
import { ValidationService } from '../../services/validation/validation.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
// components
import { UserSession, PageTitle, Phone, PhoneType, Category, Subcategory} from '../../helpers/classes';
import { SpinnerOneComponent } from '../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  private traderId: string;
  private isRequesting: boolean;
  private session: UserSession;

  private categoryForm: FormGroup;
  private categories: Category[] = [];
  private categoryInView: Category;
  private tempAddUpdateCategory: Category;
  private defaultCategory: Category;

  private isCategoryAddOn: boolean = false;
  private isCategoryEditOn: boolean = false; 

  private updatedCategory: Category;
  private addedCategory: Category;
  private removedCategory: Category;
  private categoryToRemove: Category;


  private subcategoryForm: FormGroup;
  private subcategories: Subcategory[] = [];
  private subcategoryInView: Subcategory;
  private tempAddUpdateSubCategory: Subcategory;
  private defaultSubcategory: Subcategory;

  private isSubCategoryAddOn: boolean = false;
  private isSubCategoryEditOn: boolean = false;

  private updatedSubCategory: Subcategory;
  private addedSubCategory: Subcategory;
  private removedSubCategory: Subcategory;
  private subcategoryToRemove: Subcategory;
 

  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private categoriesService: CategoryService, 
        private subcategoriesService: SubcategoriesService, 
        private pageTitleService: PageTitleService,
        private messagesService: ProcessMessageService,
        private loggerService: LoggerService) { }



  ngOnInit() {
    this.getUserSession();
    this.initialiseComponent();

    this.getCategories();
  
    this.setCategoryForm();
    this.setSubCategoryForm(); 
  }


  //************************************************************
  // GET DATA METHODS
  //************************************************************
  public getCategories() {
    this.categoriesService.getCategories()
      .subscribe((res: Category[]) => {
        this.onSuccessCategories(res);
      }
      , (error: Response) => this.onError(error, "getCategories"));
  }


  private onSuccessCategories(categories: Category[]) {
    this.categories = null;
    // collections return zero length when no record found as it is initialised
    if (categories.length == 0) {
      this.categories = null;
      this.categoryInView = null;
    }
    else {
      this.categories = categories;
      if (this.updatedCategory) {
        this.categoryInView = this.updatedCategory;
        this.updatedCategory = null;
      }
      else if (this.addedCategory) {
        this.categoryInView = this.addedCategory;
        this.addedCategory = null;
      }
      else if (this.removedSubCategory) {
        this.categoryInView = this.removedCategory;
        this.removedSubCategory = null;
      }
      else { this.categoryInView = this.categories[0]; }

      // get the subcategories for this category
      this.getSubcategoriesByCategoryId(this.categoryInView.categoryId);
    }
  }


  private getSubcategoriesByCategoryId(id: number) {
   
    this.subcategoriesService.getSubcategoriesByCategoryId(id)
      .subscribe((res: Subcategory[]) => {
        this.onSuccessSubCategories(res);
      }
      , (error: Response) => this.onError(error, "geSubcategories"));
  }


  private onSuccessSubCategories(subcategories: Subcategory[]) {

    this.subcategories = null;    
    // collections return zero length when no record found as it is initialised
    if (subcategories.length == 0) {
      this.subcategories = null;
      this.subcategoryInView = null;
    }
    else {
      this.subcategories = subcategories;
      if (this.updatedSubCategory) {
        this.subcategoryInView = this.updatedSubCategory;
        this.updatedSubCategory = null;
      }
      else if (this.addedSubCategory) {
        this.subcategoryInView = this.addedSubCategory;
        this.addedSubCategory = null;
      }
      else { this.subcategoryInView = this.subcategories[0]; }
    }
  }



  //*****************************************************
  // SCREEN CHANGE CATEGORIES 
  //*****************************************************
  private onViewCategoryChange(category: any) {
    let m: number = 0;
    for (m = 0; m < this.categories.length; m++) {

      if (this.categories[m].categoryDescription === category.target.value) {
        // set categories
        this.categoryInView = this.categories[m];
        this.tempAddUpdateCategory = this.categories[m];
        this.setCategoryFormDefaults();

        // reset set subcategories
        this.isSubCategoryAddOn = false;
        this.isSubCategoryEditOn = false;      
        this.getSubcategoriesByCategoryId(this.categoryInView.categoryId);
        this.setSubCategoryFormDefaults();
      }
    }
  }


  private onCategoryAddClick() {
    this.messagesService.emitRoute("nill");
    this.isCategoryAddOn = true;
    this.setCategoryForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.categoryInView) {
      this.tempAddUpdateCategory = this.categoryInView;
      this.categoryInView = null;
    }
  }


  private onCategoryEditClick() {
    this.messagesService.emitRoute("nill");
    this.isCategoryEditOn = true;

    // if phone in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateCategory = this.categoryInView;
    this.setCategoryForm();
    this.setCategoryFormDefaults();
  }


  private onCategoryAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isCategoryAddOn == true) { this.isCategoryAddOn = false; }
    if (this.isCategoryEditOn == true) { this.isCategoryEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateCategory) { this.categoryInView = this.tempAddUpdateCategory; }
  }


  private onSubmitCategoryAddUpdate() {

    this.removedCategory = null;
    this.messagesService.emitRoute("nill");
    let category: Category = this.prepareAddUpdateCategory();

    if (this.isCategoryAddOn) {

      if (category) { // if category does not exist
           
            // add new category
            this.categoriesService.addCategory(category)
              .subscribe((response: Category) => {
                // reset the others
                this.updatedCategory = null;
                this.removedCategory = null;
                // get the new category so we can display it when we come from the server
                this.addedCategory = response;
                // show success
                this.messagesService.emitProcessMessage("PMSACa");
                // get the new data from the server
                this.getCategories();

              }, (serviceError: Response) => this.onError(serviceError, "onSubmitCategoryAdd"));

            // go back to view
            this.isCategoryAddOn = !this.isCategoryAddOn;
      }
    }


    if (this.isCategoryEditOn) {

      if (category) { // if category changed or is not the same
           
            // update category
            this.categoriesService.updateCategory(category)
              .subscribe((response: Category) => {
              // reset the others
                this.addedCategory = null;
                this.removedCategory = null;
              // get the saved category to pass it when we get the date from the server 
              this.updatedCategory = response;
              // show success
              this.messagesService.emitProcessMessage("PMSUCa");
              // get the new data from the server
              this.getCategories();

            }, (serviceError: Response) => this.onError(serviceError, "onSubmitUpdate"));

            // go back to view
            this.isCategoryEditOn = !this.isCategoryEditOn;
      }
    }

  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdateCategory(): Category {

    const formModel = this.categoryForm.value;

    let newAddUpdateCategory: Category = new Category();

    if (this.isCategoryEditOn) { newAddUpdateCategory.categoryId = this.categoryInView.categoryId; }
    newAddUpdateCategory.categoryDescription= formModel.categorydescription as string;
   

    // has anything beeing changed in the form and we are updating
    if (this.isCategoryEditOn && !this.isCategoryChanged(newAddUpdateCategory, this.tempAddUpdateCategory)) {
      this.messagesService.emitProcessMessage("PMEUCa");
      return null;
    }
    if (this.catExists(newAddUpdateCategory)) {
      this.messagesService.emitProcessMessage("PMEUCaE");
      return null;
    }

    return newAddUpdateCategory;
  }

  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private isCategoryChanged(newCategory: Category, oldCategory: Category): boolean {
    if (newCategory.categoryDescription === oldCategory.categoryDescription) {  return false; }
    return true;
  }


  private catExists(cat: Category): boolean {
    let m: number = 0;
    for (m = 0; m < this.categories.length; m++) {
      if (cat.categoryDescription === this.categories[m].categoryDescription) { return true; }
    }
    return false;
  }


  private onCategoryDeleteClick() {
    this.categoryToRemove = this.categoryInView;
  }


  private onSubmitDeleteCategory(categoryToRemove) {
 
    this.categoriesService.deleteCategory(categoryToRemove.categoryId)
      .subscribe((response: Category) => {
          // reset the update and add
          this.addedCategory = null;
          this.updatedCategory = null;
          // show success
          this.messagesService.emitProcessMessage("PMSDCa");
          // get the new data from the server and start again
          this.getCategories();
   
      }, (serviceError: Response) => this.onError(serviceError, "onSubmitCategoryDelete"));
  }




  //*****************************************************
  // SCREEN CHANGE SUBCATEGORIES 
  //*****************************************************
  private onViewSubcategoryChange(subcategory: any) {
    let m: number = 0;
    for (m = 0; m < this.subcategories.length; m++) {
      if (this.subcategories[m].subcategoryDescription === subcategory.target.value) {
        this.subcategoryInView = this.subcategories[m];
        this.tempAddUpdateSubCategory = this.subcategories[m];
        this.setSubCategoryFormDefaults();
      }
    }
  }


  private onSubCategoryAddClick() {
    this.messagesService.emitRoute("nill");
    this.isSubCategoryAddOn = true;
    this.isSubCategoryEditOn = false;

    this.setSubCategoryForm();

    // if address in view take it as temp so we can go back if adding has been cancelled
    if (this.subcategoryInView) {
      this.tempAddUpdateSubCategory = this.subcategoryInView;
      this.subcategoryInView = null;
    }
  }


  private onSubCategoryEditClick() {
    this.messagesService.emitRoute("nill");
    this.isSubCategoryEditOn = true;
    this.isSubCategoryAddOn = false;

    // if subcategory in view take it as temp so we can go back if editing has been cancelled
    this.tempAddUpdateSubCategory = this.subcategoryInView;
    this.setSubCategoryForm();
    this.setSubCategoryFormDefaults();
  }


  private onSubCategoryAddEditCancel() {
    this.messagesService.emitRoute("nill");
    if (this.isSubCategoryAddOn == true) { this.isSubCategoryAddOn = false; }
    if (this.isSubCategoryEditOn == true) { this.isSubCategoryEditOn = false; }
    // if we are cancelling the adding or editing
    if (this.tempAddUpdateSubCategory) { this.subcategoryInView = this.tempAddUpdateSubCategory; }
  }


  private onSubmitSubCategoryAddUpdate() {
  
    this.messagesService.emitRoute("nill");
    let subcategory: Subcategory = this.prepareAddUpdateSubCategory();

    if (this.isSubCategoryAddOn) {

      if (subcategory) {  // does subcategory exists

            this.updatedSubCategory = null;
           
            // add new phone
            this.subcategoriesService.addSubcategory(subcategory)
              .subscribe((response: Subcategory) => {
                 // reset the athers
                this.updatedSubCategory = null;                             
                this.removedSubCategory = null;
                // get the new added subcategory so when we come back from the server we can display it in view
                this.addedSubCategory = response;
                // show success
                this.messagesService.emitProcessMessage("PMSASCa");
                // get the new data from the server
                this.getSubcategoriesByCategoryId(this.categoryInView.categoryId);

              }, (serviceError: Response) => this.onError(serviceError, "onSubmitSubCategoryAddUpdate"));

            // go back to view
            this.isSubCategoryAddOn = !this.isSubCategoryAddOn;
          }
    }


    if (this.isSubCategoryEditOn) {

      if (subcategory) { // if subcategory changed

            this.addedSubCategory = null;

            // update subcategory
            this.subcategoriesService.updateSubcategory(subcategory)
              .subscribe((response: Subcategory) => {
              // reset the athers
              this.addedSubCategory = null;
              this.removedSubCategory = null;
              // get the saved address so when we can put it in view when we come back from the server
              this.updatedSubCategory = response;
              // show success
              this.messagesService.emitProcessMessage("PMSUSCa"); 
              // get the new data from the server
              this.getSubcategoriesByCategoryId(this.categoryInView.categoryId);

            }, (serviceError: Response) => this.onError(serviceError, "onSubmitSubCategoryAddUpdate"));

            // go back to view
            this.isSubCategoryEditOn = !this.isSubCategoryEditOn;
          }
    }
  }


  // prepare the new add or update data - get it from the form
  private prepareAddUpdateSubCategory():Subcategory {

    const formModel = this.subcategoryForm.value;

    let newAddUpdateSubCategory: Subcategory = new Subcategory();

    if (this.isSubCategoryEditOn) { newAddUpdateSubCategory.subcategoryId = this.subcategoryInView.subcategoryId; }
    newAddUpdateSubCategory.subcategoryDescription = formModel.subcategorydescription as string;
    newAddUpdateSubCategory.categoryId = this.categoryInView.categoryId;

    // has anything beeing changed in the form and we are updating
    if (this.isSubCategoryEditOn && !this.isSubcategoryChanged(newAddUpdateSubCategory, this.tempAddUpdateSubCategory)) {
      this.messagesService.emitProcessMessage("PMEUSCa");
      return null;
    }
    if (this.subcatExists(newAddUpdateSubCategory)) {
      this.messagesService.emitProcessMessage("PMEUSCaE");
      return null;
    }

    return newAddUpdateSubCategory;
  }


  // as the form has been prepopulated when updating we can not use the form dirty on changed
  // we have custom method to compare the new and old
  private isSubcategoryChanged(newSubCategory: Subcategory, oldSubCategory: Subcategory): boolean {

    if (newSubCategory.subcategoryDescription === oldSubCategory.subcategoryDescription) { return false; }
    return true;
  }


  private subcatExists(subcat: Subcategory): boolean {
    let m: number = 0;
    for (m = 0; m < this.subcategories.length; m++) {
      if (subcat.subcategoryDescription === this.subcategories[m].subcategoryDescription) {  return true; }
    }
    return false;
  }


  private onSubCategoryDeleteClick() {
    this.subcategoryToRemove = this.subcategoryInView;
  }


  private onSubmitDeleteSubCategory(subcategoryToRemove) {
    this.addedSubCategory = null;
    this.updatedSubCategory = null;

    this.subcategoriesService.deleteSubcategory(subcategoryToRemove.subcategoryId)
      .subscribe((response: Subcategory) => {
        // reset the update and add
          this.addedSubCategory = null;
          this.updatedSubCategory = null;
          // initiate the flag that subcategory has been deleted
          this.removedSubCategory = response;
          // grab the parent category at the moment of deletetion
          this.removedCategory = this.categoryInView;        
          // show success
          this.messagesService.emitProcessMessage("PMSDSCa");
          // get the new data from the server
          this.getCategories();
       
      }, (serviceError: Response) => this.onError(serviceError, "onSubSubmitSubCategoryDeleted"));
  }

  //************************************************************
  // SETUP FORM METHODS
  //************************************************************
  private setCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      categorydescription: new FormControl('', [Validators.required]),
    });
  }


  private setSubCategoryForm() {
    this.subcategoryForm = this.formBuilder.group({      
      subcategorydescription: new FormControl('', [Validators.required]),   
    });
  }


  private setCategoryFormDefaults() {

    let m: number = 0;
    for (m = 0; m < this.categories.length; m++) {
      if (this.categories[m].categoryDescription == this.categoryInView.categoryDescription) {
        this.defaultCategory = this.categories[m];
        break;
      }
    }

    setTimeout(() => {
      this.categoryForm.setValue({
        categorydescription: this.defaultCategory.categoryDescription,
      });
    }, 30);   
  }


  private setSubCategoryFormDefaults() {

    let m: number = 0;
    //for (m = 0; m < this.categories.length; m++) {
    //  if (this.categories[m].categoryDescription == this.categoryInView.categoryDescription) { this.defaultCategory = this.categories[m]; }
    //}

    for (m = 0; m < this.subcategories.length; m++) {
      if (this.subcategories[m].subcategoryDescription == this.subcategoryInView.subcategoryDescription) {
        this.defaultSubcategory = this.subcategories[m];
        break;
      }
    }

    setTimeout(() => {
      this.subcategoryForm.setValue({    
        subcategorydescription: this.defaultSubcategory.subcategoryDescription,
      });
    }, 30);
  }


  //************************************************************
  // HELPER METHODS
  //************************************************************
  private getUserSession() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.messagesService.emitRoute("nill");
    this.pageTitleService.emitPageTitle(new PageTitle("Categories"));
  }




  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

    this.isRequesting = false;
    let message: string = "";

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    // PME used to pass the message 
    if (serviceError.error === undefined) {

      var data = serviceError.json();

      if (data.ModelState !== undefined) {

        for (var key in data.ModelState) {
          for (var i = 0; i < data.ModelState[key].length; i++) {

            if (message == null) { message = data.ModelState[key][i]; }
            else { message = message + data.ModelState[key][i]; }
          }
        }
      }
      this.messagesService.emitProcessMessage("PME", message);
    }
    else if (serviceError.error.ModelState !== undefined) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error.Message); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error
  }

}



