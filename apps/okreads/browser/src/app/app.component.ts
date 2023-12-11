import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getTotalUnread } from '@tmo/books/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  totalUnread$ = this.store.select(getTotalUnread);
  constructor(private readonly store: Store) { }
}