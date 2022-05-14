import { connect } from 'react-redux'
import { get } from 'lodash'

import DirectoryItemResult from './DirectoryItemResult'

const mapStateToProps = (state: any, props: any) => {
  const { itemId = '' } = props
  const item = get(state, `directoryResults.directories.${itemId}`, undefined)

  return {
    item,
  }
}

export default connect(mapStateToProps, null)(DirectoryItemResult)
