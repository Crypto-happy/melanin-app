import React from 'react'
import { getScreenOptions } from '../../../utils/navigation'

function withCustomHeader(headerOptions: any) {
  return function (WrappedComponent: any) {
    return class extends React.Component<any, any> {
      componentDidMount() {
        this.props.navigation.setOptions(getScreenOptions(headerOptions, this.props.navigation))
      }

      render() {
        return <WrappedComponent {...this.props} />
      }
    }
  }
}

export default withCustomHeader
