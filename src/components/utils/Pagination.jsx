import React from 'react'
import { Link } from 'react-router-dom'
import URI from 'urijs'
import _ from 'lodash'
import './Pagination.css'

export const Pagination = ({ location, url, calculated, total, cursor = 1, limit = 10, className }) => {
  if (location && !url) url = location.pathname + location.hash + location.search
  if (calculated) ({ total, cursor, limit } = calculated)

  if (!total) return null
  let paging = new Calculator(total, cursor, limit)

  url = URI(url).setSearch({ limit: paging.limit })

  let step = 7
  let barStart = Math.min(
    paging.pages,
    Math.max(
      1,
      paging.cursor - parseInt(step / 2, 10)
    )
  )
  let barEnd = Math.min(paging.pages, barStart + step - 1)

  return (
    <nav className='Pagination clearfix'>
      <div className='summary'>
        <span>{`当前第 ${paging.start + 1} - ${paging.end} 条，共 ${paging.total} 条，每页展现 ${paging.limit} 条`}</span>
      </div>
      <ul className='page-list'>
        <li className={paging.hasPrev ? 'page-item' : 'page-item-disabled'}>
          <Link className='page-link' to={URI(url).setSearch({ cursor: paging.prev }).href()}><span>&laquo;</span></Link>
        </li>

        {barStart === 2 &&
          <li className='page-item'>
            <Link className='page-link' to={URI(url).setSearch({ cursor: 1 }).href()}>1</Link>
          </li>
        }
        {barStart >= 3 &&
          <li className='page-item'>
            <Link className='page-link' to={URI(url).setSearch({ cursor: 1 }).href()}>1</Link>
          </li>
        }
        {barStart >= 3 &&
          <li className='page-item'>
            <Link className='page-link' to={URI(url).setSearch({ cursor: 2 }).href()}>2</Link>
          </li>
        }
        {barStart > 3 &&
          <li className='page-item-disabled'>
            <Link className='page-link' to=''>...</Link>
          </li>
        }

        {_.range(barStart, barEnd + 1).map(page =>
          <li key={page} className={page === +cursor ? 'page-item-active' : 'page-item'}>
            <Link className='page-link' to={URI(url).setSearch({ cursor: page }).href()}>{page}</Link>
          </li>
        )}

        {barEnd < paging.pages - 1 &&
          <li className='page-item-disabled'>
            <Link className='page-link' to=''>...</Link>
          </li>
        }
        {barEnd < paging.pages &&
          <li className='page-item'>
            <Link className='page-link' to={URI(url).setSearch({ cursor: paging.pages }).href()}>{paging.pages}</Link>
          </li>
        }

        <li className={paging.hasNext ? 'page-item' : 'page-item-disabled'}>
          <Link className='page-link' to={URI(url).setSearch({ cursor: paging.next }).href()}><span>&raquo;</span></Link>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination

/*
    Pagination

    Pure paging implementation reference.
    纯粹的分页参考实现。

    属性
        data        数据
        total       总条数
        cursor      当前页数，第几页，从 1 开始计算
        limit       分页大小
        pages       总页数
        start       当前页的起始下标
        end         当前页的结束下标
        hasPrev     是否有前一页
        hasNext     是否有下一页
        hasFirst    是否有第一页
        hasLast     是否有最后一页
        prev        前一页
        next        后一页
        first       第一页
        last        最后一页
        focus       当前页的当前焦点下标
    方法
        calc()              计算分页状态，当属性值发生变化时，方法 calc() 被调用。
        moveTo(cursor)      移动到指定页
        moveToPrev()        移动到前一页
        moveToNext()        移动到下一页
        moveToFirst()       移动到第一页
        moveToLast()        移动到最后一页
        fetch(arr)          获取当前页的数据，或者用当前状态获取参数 arr 的子集
        setData(data)       更新数据集合
        setTotal(total)     更新总条数
        setCursor(cursor)   更新当前页数
        setFocus(focus)     设置当前焦点
        setLimit(limit)     设置分页大小
        get(focus)          获取一条数据
        toString()          友好打印
        toHTML(url)         生成分页栏

*/
/*
    new State( data, cursor, limit )
    new State( total, cursor, limit )
*/
export function Calculator (data, cursor, limit) {
  this.data = (typeof data === 'number' || typeof data === 'string') ? undefined : data
  this.total = this.data ? this.data.length : parseInt(data, 10)
  this.cursor = parseInt(cursor, 10)
  this.limit = parseInt(limit, 10)
  this.calc()
}
Calculator.prototype = {
  calc: function () {
    if (this.total && parseInt(this.total, 10) > 0) {
      this.limit = this.limit < 1 ? 1 : this.limit

      this.pages = (this.total % this.limit === 0) ? this.total / this.limit : this.total / this.limit + 1
      this.pages = parseInt(this.pages, 10)
      this.cursor = (this.cursor > this.pages) ? this.pages : this.cursor
      this.cursor = (this.cursor < 1) ? this.pages > 0 ? 1 : 0 : this.cursor

      this.start = (this.cursor - 1) * this.limit
      this.start = (this.start < 0) ? 0 : this.start // 从 0 开始计数
      this.end = (this.start + this.limit > this.total) ? this.total : this.start + this.limit
      this.end = (this.total < this.limit) ? this.total : this.end

      this.hasPrev = (this.cursor > 1)
      this.hasNext = (this.cursor < this.pages)
      this.hasFirst = this.hasPrev
      this.hasLast = this.hasNext

      this.prev = this.hasPrev ? this.cursor - 1 : 0
      this.next = this.hasNext ? this.cursor + 1 : 0
      this.first = this.hasFirst ? 1 : 0
      this.last = this.hasLast ? this.pages : 0

      this.focus = this.focus ? this.focus : 0
      this.focus = this.focus % this.limit + this.start
      this.focus = this.focus > this.end - 1 ? this.end - 1 : this.focus
    } else {
      this.pages = this.cursor = this.start = this.end = 0
      this.hasPrev = this.hasNext = this.hasFirst = this.hasLast = false
      this.prev = this.next = this.first = this.last = 0
      this.focus = 0
    }

    return this
  },
  moveTo: function (cursor) {
    this.cursor = parseInt(cursor, 10)
    return this.calc()
  },
  moveToPrev: function () {
    return this.moveTo(this.cursor - 1)
  },
  moveToNext: function () {
    return this.moveTo(this.cursor + 1)
  },
  moveToFirst: function () {
    return this.moveTo(1)
  },
  moveToLast: function () {
    return this.moveTo(this.pages)
  },
  fetch: function (arr) {
    return (arr || this.data).slice(this.start, this.end)
  },
  setData: function (data) {
    this.data = data
    this.total = data.length
    return this.calc()
  },
  setTotal: function (total) {
    this.total = parseInt(total, 10)
    return this.calc()
  },
  setCursor: function (cursor) {
    this.cursor = parseInt(cursor, 10)
    return this.calc()
  },
  setFocus: function (focus) {
    this.focus = parseInt(focus, 10)
    if (this.focus < 0) this.focus += this.total
    if (this.focus >= this.total) this.focus -= this.total
    this.cursor = parseInt(this.focus / this.limit, 10) + 1
    return this.calc()
  },
  setLimit: function (limit) {
    this.limit = parseInt(limit, 10)
    return this.calc()
  },
  get: function (focus) {
    if (focus !== undefined) return this.data[focus % this.data.length]
    else return this.data[this.focus]
  },
  toString: function () {
    return JSON.stringify(this, null, 4)
  },
  map: function (iteratee) {
    let result = []
    for (let i = 0; i < this.pages; i++) {
      result.push(iteratee(i + 1))
    }
    return result
  }
}
Calculator.prototype.to = Calculator.prototype.moveTo
Calculator.prototype.toPrev = Calculator.prototype.moveToPrev
Calculator.prototype.toNext = Calculator.prototype.moveToNext
Calculator.prototype.toFirst = Calculator.prototype.moveToFirst
Calculator.prototype.toLast = Calculator.prototype.moveToLast
