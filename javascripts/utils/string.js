// this assumes space-delimmed input like 'start date'
// and returns the camel-cased equivalent: 'startDate'

export const camelize = function(str) {
  return str.replace(/\W+(.)/g, function(match, chr){
    return chr.toUpperCase();
  });
}

// convert camel-case to space-deliminated
// 'startDate' => 'start date'
export const humanize = function(str){
  return str.replace(/[A-Z]+/g,function(match){
    return ' '+ match.toLowerCase()
  });
}

// change spaces to hyphens and downcase
// 'wibble Boss' => 'wibble-boss'
export const hyphenize = function(str) {
  return str.replace(/\W+(.)/g, function(match, chr){
    return '-' + chr.toLowerCase()
  });
}
