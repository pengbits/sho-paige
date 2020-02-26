export default () => {
  // https://stackoverflow.com/questions/44462665/how-do-you-use-jest-to-test-img-onerror
  // Mocking Image.prototype.src to call the onload or onerror
  // callbacks depending on the src passed to it
  Object.defineProperty(global.Image.prototype, 'src', {
  // Define the property setter
    set(src) {
      if (src === IMAGE_LOAD_FAILURE_SOURCE) {
        this.onerror()//new Error('mocked error'))
      } else if (src === IMAGE_LOAD_SUCCESS_SOURCE) {
        this.onload()
      }
    }
  })
}


export  const IMAGE_LOAD_FAILURE_SOURCE = 'IMAGE_LOAD_FAILURE_SOURCE';
export  const IMAGE_LOAD_SUCCESS_SOURCE = 'IMAGE_LOAD_SUCCESS_SOURCE';

