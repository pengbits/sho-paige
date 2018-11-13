// these assume space-delimmed input like 'start date'
export const camelize = function(str) {
  return str.replace(/\W+(.)/g, function(match, chr){
    return chr.toUpperCase();
  });
}

export const hyphenize = function(str) {
  return str.replace(/\W+(.)/g, function(match, chr){
    return '-' + chr.toLowerCase()
  });
}