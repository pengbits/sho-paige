export const smallImageUrlError = {
  "timestamp": 1548784894393,
  "status": {
    "code": 422,
    "success": false,
    "message": "Unprocessable Entity"
  },
  "fieldStatus": {
    "fieldErrorMap": {
      "smallImageUrl": [{
        "code": 422,
        "message": "Small Image Url field length exceeded."
      }]
    }
  },
  "payload": null
}
export const smallImageUrlErrorXhrResponse = {
  "response" : {
    "status" : 422,
    "statusText" : "Unprocessable Entity",
    "data"    : smallImageUrlError
  }
}

export const negativeIdErrors = {
  "timestamp": 1548794978296,
  "status": {
    "code": 422,
    "success": false,
    "message": "Unprocessable Entity"
  },
  "fieldStatus": {
    "fieldErrorMap": {
      "seriesId": [{
        "code": 422,
        "message": "Series ID can only be positive."
      }], 
      "seasonNumber" : [{
        "code": 422,
        "message": "Season number can only be positive."
      }], 
      "showId" : [{
        "code": 422,
        "message": "Show ID can only be positive."
      }]
    }
  },
  "payload": null
}



export const negativeIdErrorsXhrResponse = {
  "response" : {
    "status" : 422,
    "statusText" : "Unprocessable Entity",
    "data"    : negativeIdErrors
  }
}