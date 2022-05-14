import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import BusinessCategoryItem from 'features/business-categories/components/BusinessCategoryItem'
import COLORS from 'constants/colors'

interface Props {
  navigation: any
  route: any
  getBusinessCategories: () => void
  businessCategories: string[]
}

interface State {}

class BusinessCategories extends React.Component<Props, State> {
  componentDidMount() {
    this.props.getBusinessCategories()
  }

  renderItem = ({ item }) => {
    const data = { text: item }
    return <BusinessCategoryItem data={data} onPress={this.onItemPress} />
  }

  keyExtractor = (_item: any, index: number) => {
    return index.toString()
  }

  onItemPress = (category: string) => {
    const { onSelect } = this.props.route.params
    onSelect(category)
    this.props.navigation.goBack()
  }

  render() {
    const { businessCategories } = this.props

    return (
      <FlatList
        data={businessCategories}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.container}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    paddingVertical: 20,
  },
})

export default BusinessCategories
