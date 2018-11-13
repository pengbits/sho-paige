import moment from 'moment'

export const DISPLAY_DATE_FORMAT   = 'MM-DD-YYYY hh:mm'
export const UNIX_MILLISECOND_TIMESTAMP_FORMAT = 'x'
export const SEARCHABLE_PROPERTIES = ['title','name','ctaLink']
export const SORTABLE_PROPERTIES   = ['position','name','startDate','endDate']

class Promo {
  static fromAttributes(attrs){
    return new Promo(attrs)
  }
  
  constructor(attrs){
    // should we whitelist?
    this.attributes = attrs
  }
  
  get(key){ 
    return this.attributes[key]
  }
  
  set(key, value){
    this.attributes[key] = value
  }
  
  // dates and duration  
  static toDate      (t) { return moment(Number(t)) }
  static toDateStr   (o) { return moment(o).format(DISPLAY_DATE_FORMAT) }
  static toTimestamp (o) { return moment(o).format(UNIX_MILLISECOND_TIMESTAMP_FORMAT) }
  static parseDate   (s) { return moment(s, DISPLAY_DATE_FORMAT) }
  
  getStartDate(){
    return !this.get('startDate') ? false : Promo.toDate(this.get('startDate')) // timestamp => moment o
  }
  
  getEndDate(){
    return !this.get('endDate') ? false : Promo.toDate(this.get('endDate'))
  }
  
  startsOnOrBefore(dateStr){
    return this.getStartDate() && this.getStartDate().isSameOrAfter(Promo.toDate(dateStr))
  }

  endsOnOrBefore(dateStr){
    return this.getEndDate() && this.getEndDate().isSameOrBefore(Promo.toDate(dateStr))
  }
  
  // promo window
  isActive(dateTime){

    return (!this.getStartDate() || this.getStartDate().isSameOrBefore(dateTime)) &&
           (!this.getEndDate() || this.getEndDate().isSameOrAfter(dateTime))
  }
  
  isExpired(dateTime){
    return this.getEndDate() && this.getEndDate().isBefore(dateTime) 
  }
  
  isUpcoming(dateTime){
    return this.getStartDate() && this.getStartDate().isAfter(dateTime)
  }
  
  window(opts={}){
    const dateTime = opts.dateTime || new moment()
    const win = {
      'active'      : this.isActive(dateTime),
      'upcoming'    : this.isUpcoming(dateTime),
      'expired'     : this.isExpired(dateTime)
    }

    // exctract the promotional window case that is true into status
    // (assumes only one case can be true at a time)
    const status = Object.keys(win).find((key) => win[key])
    return {...win, status} 
  }
  
  duration() {
    return this.get('endDate') - this.get('startDate')
  }

  getOffsetDuration() {
    const d = this.duration()
    const startDate = this.get('startDate') + d
    const   endDate = this.get('endDate') + d

    return { 
      startDate, 
      endDate
    }
  }
  

  
  // cloning
  // unlike static version in utils/index, this returns an instance of the Promo model
  // and not a simple hash of attributes...
  clone(opts={}) {
    // remove the id if it exists
    const {'id': deletedKey, ...attrs} = this.attributes

    // generate name variant
    const name = this.copyName()
    
    // change the startDate and endDate if desired
    const {startDate,endDate} = opts.offsetDuration ? 
      this.getOffsetDuration() : this.attributes
  
    return Promo.fromAttributes({
      ...attrs,
      name,
      startDate,
      endDate
    })
  }
  
  copyName(){
    // @todo support for Copy 1 -> Copy 2 etc
    const name = this.get('name') || 'Untitled Promo'
    return name.replace(/\s\(Copy\)$/,'') + ' (Copy)'
  }
  
  // filtering by text property
  textContains(text){
    return !!SEARCHABLE_PROPERTIES.find(key => {
      return (this.get(key) && this.get(key).indexOf(text) > -1) 
    })
  }

  // utils
  static sortableProperty(property){
    return SORTABLE_PROPERTIES.includes(property)
  }
}

export default Promo