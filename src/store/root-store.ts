export let storeInstances: any[] = []

const addRefStore = (store: any) => {
  storeInstances.push(store)
}

const dispatch = (action: any) => {
  if (storeInstances.length === 0) {
    return
  }

  storeInstances[0].dispatch(action)
}

const getState = () => {
  if (storeInstances.length === 0) {
    return
  }

  return storeInstances[0].getState()
}

export { addRefStore, dispatch, getState }
