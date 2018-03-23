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
  private subcategoryForm: FormGroup;

  private isCategoryAddOn: boolean = false;
  private isCategoryEditOn: boolean = false;
  private isSaveCategoryOn: boolean = false;

  private isSubCategoryAddOn: boolean = false;
  private isSubCategoryEditOn: boolean = false;
  private isSaveSubCategoryOn: boolean = false;

  private categories: Category[] = [];
  private categoryInView: Category;
  private tempAddUpdateCategory: Category;
  private defaultCategory: Category;


  private subcategories: Subcategory[] = [];
  private subcategoryInView: Subcategory;
  private tempAddUpdateSubCategory: Subcategory;
  private defaultSubcategory: Subcategory;

  private updatedCategory: Category;
  private addedCategory: Category;
  private categoryToRemove: Category;

  private updatedSubCategory: Subcategory;
  private addedSubCategory: Subcategory;
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
    // collections return zero length when no record found as it is initialised
    if (categories.length == 0) {
      this.categories = null;
      this.categoryInView = null;
    }
    else {
      this.categories = categories;
      this.categoryInView = this.categories[0];
      this.getSubcategoriesByCategoryId(this.categoryInView.categoryId);
    }
  }


  private getSubcategoriesByCategoryId(id:number) {
    this.subcategoriesService.getSubcategoriesByCategoryId(id)
      .subscribe((res: Subcategory[]) => {
        this.onSuccessSubCategories(res);
      }
      , (error: Response) => this.onError(error, "geSubcategories"));
  }


  private onSuccessSubCategories(subcategories: Subcategory[]) {
    // collections return zero length when no record found as it is initialised
    if (subcategories.length == 0) {
      this.subcategories = null;
      this.subcategoryInView = null;
    }
    else {
      this.subcategories = subcategories;
      this.subcategoryInView = this.subcategories[0];
    }
  }


 


  //*****************************************************
  // SCREEN CHANGE SELECTION 
  //*****************************************************
  private onViewCategoryChange(category: any) {
    let m: number = 0;
    for (m = 0; m < this.categories.length; m++) {
      if (this.categories[m].categoryDescription === category.target.value) {
        this.categoryInView = this.categories[m];
        this.tempAddUpdateCategory = this.categories[m];
        this.setCategoryFormDefaults();
        this.getSubcategoriesByCategoryId(this.categoryInView.categoryId);
      }
    }
  }

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

  private onCategoryChange(category: Category) {
    this.subcategories = category.subcategories;
  }



  //************************************************************
  // SETUP FORM METHODS
  //************************************************************
  private setCategoryForm() {
    this.categoryForm = this.formBuilder.group({  
      categorydescription: new FormControl('', [Validators.required, ValidationService.phonetypeValidator]),   

    });
  }


  private setSubCategoryForm() {
    this.subcategoryForm = this.formBuilder.group({
      category: new FormControl('', [Validators.required, ValidationService.preferredValidator]),
      subcategoryDescription: new FormControl('', [Validators.required, ValidationService.phonetypeValidator]),   
    });
  }


  private setCategoryFormDefaults() {

    let m: number = 0;
    for (m = 0; m < this.categories.length; m++) {
      if (this.categories[m].categoryDescription == this.categoryInView.categoryDescription) { this.defaultCategory = this.categories[m]; }
    }

    setTimeout(() => {
      this.categoryForm.setValue({
        categorydescription: this.defaultCategory.categoryDescription,
      });
    }, 30);
  }


  private setSubCategoryFormDefaults() {

    let m: number = 0;
    for (m = 0; m < this.categories.length; m++) {
      if (this.categories[m].categoryDescription == this.categoryInView.categoryDescription) { this.defaultCategory = this.categories[m]; }
    }

    for (m = 0; m < this.subcategories.length; m++) {
      if (this.subcategories[m].subcategoryDescription == this.subcategoryInView.subcategoryDescription) { this.defaultSubcategory = this.subcategories[m]; }
    }

    setTimeout(() => {
      this.categoryForm.setValue({
        categorydescription: this.defaultCategory.categoryDescription,
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



