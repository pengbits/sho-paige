import moment from 'moment'

export const DISPLAY_DATE_FORMAT   = 'MM-DD-YYYY hh:mm A'
export const UNIX_MILLISECOND_TIMESTAMP_FORMAT = 'x'
export const SEARCHABLE_PROPERTIES = ['title','name','ctaLink']
export const SORTABLE_PROPERTIES   = ['id','position', 'context', 'name','startDate','endDate']

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
  

  static toDate      (t) { return moment(Number(t)) }
  static toDateStr   (o) { return moment(o).format(DISPLAY_DATE_FORMAT) }
  static toTimestamp (o) { return Number(moment(o).format(UNIX_MILLISECOND_TIMESTAMP_FORMAT)) }
  static parseDate   (s) { return moment(s, DISPLAY_DATE_FORMAT) }
  static now         ()  { return Promo.toTimestamp(moment())}
  
  //copy promo
  static promoCopyRegex () { return /\s\(Copy\s(0*[1-9][0-9]*)\)$/ }
  
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
  
  // returns true for promos with a window that contains the date, 
  // or with a window in the future
  inWindowForStartDate(startDate){
    return !this.getEndDate() || this.getEndDate().isSameOrAfter(startDate)
  }
  
  // returns true for promos with a window that contains the date, 
  // or with a window in the past
  inWindowForEndDate(endDate){
    return !this.getStartDate() || this.getStartDate().isSameOrBefore(endDate)
  }
  
  // returns true for 
  // ("promos that start before or on the end-date" AND "don't end before the start-date")
  // "OR"
  // ("promos that end after or on the start-date" AND "don't start after the end-date")
  inWindowForStartAndEndDates({startDate,endDate}){
    return (
      ((!this.getStartDate() || this.getStartDate().isSameOrBefore(endDate)) && (!this.getEndDate()   || this.getEndDate().isSameOrAfter(startDate))) ||
      ((!this.getEndDate()   || this.getEndDate().isSameOrAfter(startDate))  && (!this.getStartDate() || this.getStartDate().isSameOrBefore(endDate)))
    )
  }
  
  isExpired(dateTime){
    return this.getEndDate() && this.getEndDate().isBefore(dateTime) 
  }
  
  isUpcoming(dateTime){
    return this.getStartDate() && this.getStartDate().isAfter(dateTime)
  }

  isDraft () {
    return this.get('isDraft')
  }
  
  window(opts={}){
    const dateTime = opts.dateTime || new moment()
    const win = {
      'draft'       : this.isDraft(),
      'active'      : this.isActive(dateTime),
      'upcoming'    : this.isUpcoming(dateTime),
      'expired'     : this.isExpired(dateTime)      
    }

    // exctract the promotional window case that is true into status
    // (assumes only one case can be true at a time, draft trumps all othe status)
    const status = Object.keys(win).find((key) => win[key])
    return {...win, status} 
  }
  
  duration() {
    return this.get('endDate') - this.get('startDate')
  }
  
  
  // getOffsetDuration()
  // returns new start and end dates which have the same duration
  // but which begin at end of original window
  getOffsetDuration() {
    if(this.get('endDate') == undefined || this.get('startDate') == undefined){
      throw new Error('startDate and endDate are required for clone with offset duration')
    }
    
    let source = {
      'startDate' : Promo.toDate(this.get('startDate')),
        'endDate' : Promo.toDate(this.get('endDate'))
    }
    
    // set times to midnight so offset is not affected by times
    source.startDate.hour(0)
    source.startDate.minutes(0)
    source.endDate.hour(0)
    source.endDate.minutes(0)

    // get duration
    const d = moment.duration(source.endDate.diff(source.startDate))
    
    // create offset versions
    let offset = {
      'startDate' : source.startDate.add(d),
        'endDate' : source.endDate.add(d)
    }
    
    // restore times from original start + end dates
    offset.startDate.hour(this.getStartDate().hour())
    offset.startDate.minutes(this.getStartDate().minutes())
    offset.endDate.hour(this.getEndDate().hour())
    offset.endDate.minutes(this.getEndDate().minutes())

    // convert back to timestamp
    return {
      startDate : Promo.toTimestamp(offset.startDate),
        endDate : Promo.toTimestamp(offset.endDate)
    }
  }

  
  // cloning
  // unlike static version in utils/index, this returns an instance of the Promo model
  // and not a simple hash of attributes...
  clone(opts={}) {
    // remove the id if it exists
    const {'id': deletedKey, ...attrs} = this.attributes
    const {copyNumber} = opts

    // generate name variant
    const name = this.copyName(copyNumber)
    
    // change the startDate and endDate if desired
    const {startDate,endDate} = opts.offsetDuration ? 
      this.getOffsetDuration() : this.attributes
  
    return Promo.fromAttributes({
      ...attrs,
      name,
      startDate,
      endDate,
    })
  }
  
  copyName(copyNumber){
    const name = this.get('name') || 'Untitled Promo'
    const promoCopyRegex = Promo.promoCopyRegex()
    return name.replace(promoCopyRegex, "") + " (Copy " + copyNumber + ")"
  }
  
  // filtering by text property
  textContains(text){
    return !!SEARCHABLE_PROPERTIES.find(key => {
      return (this.get(key) && (this.get(key).toLowerCase()).indexOf(text.toLowerCase()) > -1) 
    })
  }

  // utils
  static sortableProperty(property){
    return SORTABLE_PROPERTIES.includes(property)
  }
}

export default Promo