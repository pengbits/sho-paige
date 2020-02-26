export const largeImageUrlSuccessXhrResponse = {
  "response"  : {
    "config"  : {},
    "data"    : 'some binary image data goes here',
    "headers" : {
      "cache-control" : "max-age=83018",
      "content-length": "55261",
      "content-type"  : "image/jpeg",
      "expires": "Thu, 14 Nov 2019 21:08:22 GMT",
      "last-modified": "Tue, 16 Feb 2016 21:21:08 GMT"
    },
    "request" : 'This is a request',
    "status" : 200,
    "statusText" : "OK",
  }
}

export const largeImageUrlFailureXhrResponse = {
  "response"  : {
    "config"  : {},
    "data"    : 'some binary image data goes here',
    "headers" : {
      "cache-control" : "max-age=83018",
      "content-length": "55261",
      "content-type"  : "image/jpeg",
      "expires": "Thu, 14 Nov 2019 21:08:22 GMT",
      "last-modified": "Tue, 16 Feb 2016 21:21:08 GMT"
    },
    "request" : 'This is a request',
    "status" : 404,
    "statusText" : "404 NOT FOUND",
  }
}