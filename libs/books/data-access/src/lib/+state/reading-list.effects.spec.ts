import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { createBook, createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';

describe('ToReadEffects', () => {
  let book: Book;
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let item: ReadingListItem
  const snackBar: MatSnackBar = null;
  beforeAll(() => {
    item = createReadingListItem('A');
    book = createBook('A');
  })
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestingModule,
        MatSnackBarModule
      ], providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });


  describe('addBook$', () => {
    it('Should add a book to the reading list', fakeAsync(() => {
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
      })

      httpMock.expectOne('/api/reading-list').flush({});
    }));

    it('Show the snack bar ahile adding a book', async () => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.confirmedAddToReadingList({ book }));

      effects.undoAddtoReadingList$.subscribe(() => {
        snackBar.open(`Added ${book.title} to reading list`, 'Undo', { duration: 2000 }).onAction().subscribe((action) => {
          expect(action).toEqual(
            ReadingListActions.removeFromReadingList({ item })
          )
        })
      });
    });

  });

  describe('removeBook$', () => {
    it('Should remove a book from reading list', done => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({ item })
        );

        done();
      });

      httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush({});
    });

    it('Show the snack bar while removing a book', async () => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item }));

      effects.undoRemoveFromReadingList$.subscribe(() => {
        snackBar.open(`Removed ${item.title} to reading list`, 'Undo', { duration: 1000 }).onAction().subscribe((action) => {
          expect(action).toEqual(
            ReadingListActions.addToReadingList({ book })
          );
        })
      });
    });

  });
});