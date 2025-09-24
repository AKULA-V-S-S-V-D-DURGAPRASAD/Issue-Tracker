import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <header class="header">
      <div class="logo">
        <div class="mark">IT</div>
        <div>
          <div style="font-weight:700">Issue Tracker</div>
          <div class="small">Simple issue tracking — FastAPI + Angular</div>
        </div>
      </div>
      <div class="small">You can create, search, filter, sort & paginate</div>
    </header>
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent { }
