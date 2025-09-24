import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html'
})
export class IssueFormComponent implements OnInit {
  issue: Issue = { title: '', description: '', status: 'Open', priority: 'Medium', assignee: '' };
  editing = false;
  id: number | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit(){
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
      this.api.getIssue(this.id!).subscribe(res => this.issue = res);
    }
  }

  save(){
    if (this.editing && this.id) {
      this.api.updateIssue(this.id, this.issue).subscribe(_ => this.router.navigate(['/']));
    } else {
      this.api.createIssue(this.issue).subscribe(_ => this.router.navigate(['/']));
    }
  }
}
