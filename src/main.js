import Vue from 'vue'
import App from './App.vue'

import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

Sentry.init({
  dsn: 'https://1b98a9bea5c04421a9524485215f8ad5@sentry.io/1832344',
  integrations: [new Integrations.Vue({ Vue, attachProps: true })]
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
