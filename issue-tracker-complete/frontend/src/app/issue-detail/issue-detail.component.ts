import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html'
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.api.getIssue(id).subscribe(res => this.issue = res);
    }
  }
}
