import DefaultConfig     from './default'
import EmailSignupConfig from './email-signup'
import ShoPlaceWhatsOnConfig from './shoplace'
export const INPUTS_IN_HEAD = ['position','name','startDate','endDate'] // this is not customizable for the context!

export default {
  'default' : DefaultConfig,
  'email-module' : EmailSignupConfig,
  'whats-on'     : ShoPlaceWhatsOnConfig
}