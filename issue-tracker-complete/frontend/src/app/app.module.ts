import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';
import { IssueFormComponent } from './issue-form/issue-form.component';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [AppComponent, IssuesListComponent, IssueDetailComponent, IssueFormComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
