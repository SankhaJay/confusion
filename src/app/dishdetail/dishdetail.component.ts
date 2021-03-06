import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand} from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [visibility(),flyInOut(),expand()],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display:block;'
  },
})
export class DishdetailComponent implements OnInit {
  // @Input()
  // dish:Dish;

  commentForm: FormGroup;
  comment: Comment;
  errMsg: string;
  dishcopy: Dish;
  visibility = 'shown';

  @ViewChild('fform') commentFormDirectives;

  formErrors = {
    author: '',
    comment: '',
  };

  validationMessages = {
    author: {
      required: 'Your name is required',
      minlength: 'Your name must be at least 2 characters long',
    },
    comment: {
      required: 'Your comment is required',
    },
  };

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  prevComment: Comment = new Comment();

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.prevComment = null;
    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    console.log(this.dishIds);
    let id = this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = 'hidden';
          return this.dishService.getDish(params['id']);
        })
      )
      .subscribe(
        (dish) => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
        },
        (errmsg) => (this.errMsg = <any>errmsg)
      );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: '5',
      comment: ['', [Validators.required]],
    });

    this.commentForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
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

  onSubmit() {
    this.prevComment = new Comment();
    this.comment = this.commentForm.value;
    this.prevComment.author = this.comment.author;
    this.prevComment.comment = this.comment.comment;
    this.prevComment.rating = this.comment.rating;
    const date = new Date();
    this.prevComment.date = date.toISOString();
    this.dishcopy.comments.push(this.prevComment);
    this.dishService.putDish(this.dishcopy).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      (errmsg) => {
        this.dish = null;
        this.dishcopy = null;
        this.errMsg = <any>errmsg;
      }
    );
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: '5',
    });
    // this.commentFormDirectives.reset();
  }
}
