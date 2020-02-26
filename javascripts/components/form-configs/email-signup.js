// default dataType is 'text'
// default inputType is 'text'
const CONFIG = {
  name:'promo', 
  context: "email-signup",
  head:{
    name:'head',
    inline:true,
    children: [{
      "name"      : "position",
      "dataType"  : "number", // creating a css issue but this is where we wanna go with this..
      "inputType" : "text",
      "validate"  : {'isNumber':true, 'minValue':0, 'maxValue':1000}
    },{
      "name"      : "name",
      "inputType" : "text",
      "validate"  : {'maxLength':10}
    },{
      "name"      : "startDate",
      "dataType"  : "datetime",
      "inputType" : "datetime",
      "validate"  : {'validForEndDate': true }
    },{
      "name"      : "endDate",
      "dataType"  : "datetime",
      "inputType" : "datetime",
      "validate"  : {'validForStartDate': true }
    }]
  },
  body:{
    name: "body",
    children : [{
      "name"      : "title",
      "inputType" : "text",
      "validate"  : {'required':true, 'maxLength':200}
    },{
      "name"      : "ctaLabel",
      "dataType"  : "text",
      "inputType" : "text",
      "validate"  : {'maxLength':150}
    }]
  },
  footer:{
    name: "footer",
    children : [{
      "name"      : "setDraftMode",
      "dataType"  : "boolean",
      "inputType" : "checkbox",
      "input"     : {"name":"setDraftMode"}
    }]
  }
}

export default CONFIG