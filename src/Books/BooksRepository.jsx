import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, action, toJS, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
export class BooksRepository {
  baseUrl

  @inject(Types.IDataGateway)
  dataGateway

  @inject(UserModel)
  userModel

  @inject(Config)
  config

  messagePm = 'UNSET'

  constructor() {
    makeObservable(this, { messagePm: observable })
  }

  load = async () => {
    const dto = await this.dataGateway.get(`/books?emailOwnerId=${this.userModel.email}`)
    if (dto?.success) {
      this.messagePm = {
        success: dto.success,
        books: dto.result.map((bookDto) => {
          return bookDto
        })
      }
    }
    return this.messagePm
  }

  addBook = async (name) => {
    const requestDto = {
      name: name,
      emailOwnerId: 'a@b.com'
    }
    let responseDto = await this.dataGateway.post(`/books`, requestDto)
    return MessagePacking.unpackServerDtoToPm(responseDto)
  }

  reset = () => {
    this.messagePm = 'RESET'
  }
}
