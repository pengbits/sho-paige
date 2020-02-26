import config from './default'
// import the default config as the basis for shoplace:whats-on,
// we will use it more or less unchanged, except for the ctaType options
// which we'll replace with custom values for the 'whats-on' context

const CONFIG = {
  ...config,
  name    : 'shoplace-whats-on', 
  context : 'shoplace-whats-on',
  body    : {
    ...config.body,
    children : config.body.children.map(input => {
      return (input.name !== 'ctaType') ?
        input
      :
        {
          ...input, 
          'options' : [
            'Best Sellers',
            'Series', 
            'Movies', 
            'Sports', 
            'Documentaries'
          ]
        }
    }) 
  }  
}

export default CONFIG