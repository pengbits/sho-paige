import Promo, {SEARCHABLE_PROPERTIES} from './models/Promo'

export const trace = (str,list,keyAttr,secondaryAttr=null) => {
  const formatAsDate = (val) => {
    return Promo.toDateStr(Promo.toDate(val))
  }
  const format = (key,val) => {
    if(/Date/.test(key)){
      return [null,undefined,''].includes(val) ? val : formatAsDate(val)
    } else {
      return val
    }
  }

  console.log(`${str}\n\t` + list.map((p,i) => {
    const primaryFormatted   = format(keyAttr, p[keyAttr])
    const secondaryFormatted = format(secondaryAttr, p[secondaryAttr])
    return `|${i}| #${p.id} ${keyAttr}='${primaryFormatted}' `+ (secondaryAttr ? `${secondaryAttr}='${secondaryFormatted}'` : '')
  }).join("\n\t"))
}

export const dateShort = (date) => {
  return date ? Promo.toDateStr(date).replace('12:00 AM','') : '     *     ' 
}

export const diffstr   = (promo) => {
  return ['#'+
    promo.id,
    dateShort(promo.startDate),
    '...',
    dateShort(promo.endDate),
    promo.name || ''
  ].join(' ') 
}

export const inWindowForStartDate = (p, startDate) => {
  const promo = Promo.fromAttributes(p)
  return !promo.getEndDate() || promo.getEndDate().isSameOrAfter(startDate)
}

export const inWindowForEndDate = (p, endDate) => {
  const promo = Promo.fromAttributes(p)
  return !promo.getStartDate() || promo.getStartDate().isSameOrBefore(endDate)
}

export const containsTextInSearchableProperty = (p, text) => {
  return SEARCHABLE_PROPERTIES.find(attr => (p[attr] || '').indexOf(text) > -1)
}
