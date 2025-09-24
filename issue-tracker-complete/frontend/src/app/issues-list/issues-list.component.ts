import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Issue } from '../models/issue.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html'
})
export class IssuesListComponent implements OnInit {
  issues: Issue[] = [];
  search = '';
  status = '';
  priority = '';
  assignee = '';
  sortBy = 'updatedAt';
  sortDir = 'desc';
  page = 1;
  pageSize = 10;

  selectedIssue: Issue | null = null;
  showDrawer = false;

  statuses = ['','Open','In Progress','Closed'];
  priorities = ['','Low','Medium','High'];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(){ this.load(); }

  load(){
    const opts:any = {
      search: this.search,
      status: this.status,
      priority: this.priority,
      assignee: this.assignee,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      page: this.page,
      pageSize: this.pageSize,
    };
    this.api.listIssues(opts).subscribe(res => this.issues = res);
  }

  clearFilters(){ this.search=''; this.status=''; this.priority=''; this.assignee=''; this.load(); }

  toggleSort(field: string){
    if (this.sortBy === field) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    else { this.sortBy = field; this.sortDir = 'asc'; }
    this.load();
  }

  gotoCreate(){ this.router.navigate(['/issues/new']); }
  gotoEdit(id?: number){ this.router.navigate([`/issues/${id}/edit`]); }
  openDetail(issue: Issue){ this.selectedIssue = issue; this.showDrawer = true; }
  closeDrawer(){ this.showDrawer = false; this.selectedIssue = null; }
}
