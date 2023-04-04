import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed, action } from 'mobx'
import { BooksRepository } from '../BooksRepository'

@injectable()
export class BookListPresenter {
  @inject(BooksRepository)
  booksRepository

  get viewModel() {
    if (this.booksRepository.messagePm.success) {
      return this.booksRepository.messagePm.books.map((book) => {
        return { visibleName: book.name }
      })
    } else {
      return []
    }
  }

  constructor() {
    makeObservable(this, {
      viewModel: computed
    })
  }
}
