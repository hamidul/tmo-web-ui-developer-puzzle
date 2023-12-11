import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Observable } from 'rxjs';

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

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book: { ...book, snackBar: true } }));
  }

  searchExample(): void {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks(): void {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
  ngOnInit() { }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
   }
}