import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';

import * as ReadingListActions from './reading-list.actions';
import { catchError, concatMap, exhaustMap, map, filter } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';


import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ENDPOINT_URL } from '../constants';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`${ENDPOINT_URL.READING_LIST}${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );



  undoAddtoReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      filter(({ book }) => book.snackBar),
      map(({ book }) =>
        this.openSnackBar(
          { ...book, bookId: book.id, snackBar: false },
          `${book.title}: added to the  reading list`,
          true
        )
      ),
    ),
    { dispatch: false }
  );

  undoRemoveFromReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      filter(({ item }) => item.snackBar),
      map(({ item }) =>
        this.openSnackBar(
          { ...item, id: item.bookId, snackBar: false },
          `${item.title}: removed from the reading list`,
          false
        )
      )
    ),
    { dispatch: false }
  );

  openSnackBar(item: ReadingListItem | Book, message: string, isAdded: boolean): void {
    this.snackBar.open(message, 'UNDO', {
      duration: 5000
    })
      .onAction()
      .subscribe(() =>
        isAdded ?
          this.store.dispatch(
            ReadingListActions.removeFromReadingList({
              item: item as ReadingListItem
            })
          ) :
          this.store.dispatch(
            ReadingListActions.addToReadingList({
              book: item as Book
            })
          )
      )
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private readonly snackBar: MatSnackBar,
    private readonly store: Store) { }
}