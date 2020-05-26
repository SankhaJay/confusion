import { Component, OnInit, Inject } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block;',
  },
  animations: [flyInOut(), expand()],
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  errMsg: string;


  constructor(
    private leaderService: LeaderService,
    private feedbakService: FeedbackService,
    @Inject('BaseURL') public BaseURL
  ) {}

  ngOnInit(): void {
    this.leaderService
      .getLeaders()
      .subscribe(leaders => this.leaders = leaders, errmsg => this.errMsg=<any>errmsg);
  }

 

  
}
