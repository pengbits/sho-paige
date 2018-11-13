import Promo from './models/Promo'

export const trace = (str,list,keyAttr,secondaryAttr=null) => {
  const formatAsDate = (val) => {
    return Promo.toDateStr(Promo.toDate(val))
  }
  const format = (key,val) => {
    if(/Date/.test(key)){
      return formatAsDate(val)
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