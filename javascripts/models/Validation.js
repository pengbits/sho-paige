class Validation {
  validate({dataType,value}){
    this.value = value
  
    switch (dataType) {
      case 'number':
        console.log('validate for number')
        break
        
      default:
        break    
    }
  }
  
  static validateAsNumber(value){
    
  }
    // todo
}

export default Validation