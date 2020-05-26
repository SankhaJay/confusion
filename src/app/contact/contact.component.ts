import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block;',
  },
  animations: [flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  previewFeedback: Feedback;
  isSubmit: boolean;
  showPreview: boolean;

  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: '',
  };

  validationMessages = {
    firstname: {
      required: 'First name is required',
      minlength: 'First name must be at least 2 characters long',
      maxlength: 'First name cannot be more than 25 characters',
    },
    lastname: {
      required: 'Last name is required',
      minlength: 'Last name must be at least 2 characters long',
      maxlength: 'Last name cannot be more than 25 characters',
    },
    telnum: {
      required: 'Telephone number is required',
      pattern: 'Telephone number must contain only numbers',
    },
    email: {
      required: 'Email is required',
      pattern: 'Not a valid email address',
    },
  };
  errMsg: any;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: '',
    });

    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        //clear prevoius error messages
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit()  {
    this.isSubmit = true;
    this.showPreview = false;
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '  ',
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });
    this.previewFeedback = new Feedback();
     this.feedbackService.submitFeedback(this.feedback).subscribe(
      (feedback) => {
        this.previewFeedback = feedback;
        this.isSubmit = false;
        console.log(feedback);
        this.showPreview = true;
        setTimeout(()=>{this.showPreview = false;}, 5000);
        
      },
      (errmsg) => (this.errMsg = <any>errmsg)
    );
    this.feedbackFormDirective.resetForm();
console.log("here");
    
    
  }
}
