import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';
import { IssueFormComponent } from './issue-form/issue-form.component';

const routes: Routes = [
  { path: '', component: IssuesListComponent },
  { path: 'issues/new', component: IssueFormComponent },
  { path: 'issues/:id/edit', component: IssueFormComponent },
  { path: 'issues/:id', component: IssueDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
