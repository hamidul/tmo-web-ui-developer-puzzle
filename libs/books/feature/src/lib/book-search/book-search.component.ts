
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  getBooksLoaded,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchComponent implements OnInit, OnDestroy {
  private subscription;
  constructor(
    private readonly store: Store,
    private readonly form: FormBuilder
  ) { }
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  searchForm = this.form.group({
    term: ''
  });
  destroy: Subject<void> = new Subject();
  ngOnInit(): void {
    this.searchForm.get('term').valueChanges
      .pipe(debounceTime(500),
        takeUntil(this.destroy))
      .subscribe(value => {
        if (value) {
          this.store.dispatch(searchBooks({ term: value }));
        } else {
          this.store.dispatch(clearSearch());
        }

      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample(): void {
    this.searchForm.controls.term.setValue('javascript');
  }
}