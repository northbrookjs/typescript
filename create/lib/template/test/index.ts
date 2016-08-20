import * as assert from 'assert'
import { Awesome } from '../src/index'

describe('{{ packageName }}', function () {
  it('should be awesome', function () {
    assert(new Awesome(true).isAwesome)
  })
})
