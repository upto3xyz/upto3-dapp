import store from 'store'
import expirePlugin from 'store/plugins/expire'

store.addPlugin(expirePlugin)

const init = () => {
  if (!store.enabled) {
    alert(
      'Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser'
    )
    return
  }
}

init()

export { store as localStorage }
