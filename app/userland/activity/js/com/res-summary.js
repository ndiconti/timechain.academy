import { LitElement, html } from 'beaker://app-stdlib/vendor/lit-element/lit-element.js'
import { unsafeHTML } from 'beaker://app-stdlib/vendor/lit-element/lit-html/directives/unsafe-html.js'
import css from '../../css/com/res-summary.css.js'
import { joinPath } from 'beaker://app-stdlib/js/strings.js'
import 'beaker://app-stdlib/js/com/img-fallbacks.js'

export class ResSummary extends LitElement {
  static get properties () {
    return {
      authorUrl: {type: String, attribute: 'author-url'},
      authorTitle: {type: String, attribute: 'author-title'},
      icon: {type: String},
      label: {type: String},
      title: {type: String},
      href: {type: String},
      date: {type: String},
      content: {type: String}
    }
  }

  static get styles () {
    return css
  }

  constructor () {
    super()
    this.authorUrl = undefined
    this.authorTitle = undefined
    this.icon = undefined
    this.label = undefined
    this.title = undefined
    this.href = undefined
    this.date = undefined
    this.content = undefined
  }

  // rendering
  // =

  render () {
    if (this.content) {
      return html`
        <link rel="stylesheet" href="beaker://assets/font-awesome.css">
        <div class="summary">
          <a class="thumb" href=${this.authorUrl} title=${this.authorTitle}><img src=${joinPath(this.authorUrl, 'thumb')}></a>
          <a class="author" href=${this.authorUrl} title=${this.authorTitle}>${this.authorTitle}</a>
          ${this.href ? html`
            <a class="date" href=${this.href} data-tooltip=${this.date.toLocaleString()}>${relativeDate(this.date)}</a>
          ` : html`
            <span class="date" data-tooltip=${this.date.toLocaleString()}>${relativeDate(this.date)}</span>
          `}
        </div>
        <div class="content markdown">${unsafeHTML(this.content)}</div>
      `
    }
    return html`
      <link rel="stylesheet" href="beaker://assets/font-awesome.css">
      <div class="title"><a href=${this.href} title=${this.title}>${this.title}</a></div>
      <div class="summary">
        ${this.icon ? html`<span class="fa-fw ${this.icon}"></span>` : ''}
        <span class="label">${this.label} by</span>
        <a class="thumb" href=${this.authorUrl} title=${this.authorTitle}><img src=${joinPath(this.authorUrl, 'thumb')}></a>
        <a class="author" href=${this.authorUrl} title=${this.authorTitle}>${this.authorTitle}</a>
        ${this.href ? html`
          <a class="date" href=${this.href} data-tooltip=${this.date.toLocaleString()}>${relativeDate(this.date)}</a>
        ` : html`
          <span class="date" data-tooltip=${this.date.toLocaleString()}>${relativeDate(this.date)}</span>
        `}
      </div>
    `
  }
}

customElements.define('res-summary', ResSummary)

const MINUTE = 1e3 * 60
const HOUR = 1e3 * 60 * 60
const DAY = HOUR * 24

const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'})
function relativeDate (d) {
  const nowMs = Date.now()
  const endOfTodayMs = +((new Date).setHours(23,59,59,999))
  var diff = nowMs - d
  var dayDiff = Math.floor((endOfTodayMs - d) / DAY)
  if (diff < HOUR) return rtf.format(Math.ceil(diff / MINUTE * -1), 'minute')
  if (dayDiff < 1) return rtf.format(Math.ceil(diff / HOUR * -1), 'hour')
  if (dayDiff <= 30) return rtf.format(dayDiff * -1, 'day')
  if (dayDiff <= 90) return rtf.format(Math.floor(dayDiff / 7) * -1, 'week')
  if (dayDiff <= 365) return rtf.format(Math.floor(dayDiff / 30) * -1, 'month')
  return rtf.format(Math.floor(dayDiff / 365) * -1, 'year')
}