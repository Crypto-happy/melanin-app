import React from 'react'
import {
  FlatList,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import COLORS from '../../constants/colors'
import TopicItem from 'features/follow-topics/components/TopicItem'
import localizedStrings from 'localization'
import { FONT_FAMILIES } from 'constants/fonts'
import { DEFAULT_BUTTON_HIT_SLOP } from 'constants'
import InfoModal from 'components/InfoModal'

interface Props {
  navigation: any
  getTopics: () => void
  topics: string[]
  followTopics: (topics: string[]) => void
}

interface State {
  selectedIndexes: number[]
  canSubmit: boolean
  showMaximumTopicsInfoModal: boolean
}

class FollowTopics extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedIndexes: [],
      canSubmit: false,
      showMaximumTopicsInfoModal: false,
    }
  }

  componentDidMount() {
    this.props.getTopics()
    this.setupHeader()
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (prevState.canSubmit !== this.state.canSubmit) {
      this.setupHeader()
    }
    if (
      this.state.selectedIndexes.length > 10 &&
      this.state.selectedIndexes.length > prevState.selectedIndexes.length
    ) {
      this.setState({
        showMaximumTopicsInfoModal: true,
      })
    }
  }

  setupHeader = () => {
    const { canSubmit } = this.state

    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerNextButton}
          hitSlop={DEFAULT_BUTTON_HIT_SLOP}
          onPress={this.onNextButtonPress}
          disabled={!canSubmit}>
          <Text
            style={[
              styles.headerNextButtonText,
              !canSubmit && styles.headerNextButtonDisabled,
            ]}>
            Next
          </Text>
        </TouchableOpacity>
      ),
    })
  }

  onNextButtonPress = () => {
    const { topics, followTopics } = this.props
    const { selectedIndexes } = this.state

    const selectedTopics = selectedIndexes.map((index) => topics[index])
    followTopics(selectedTopics)
  }

  validate = () => {
    const { selectedIndexes } = this.state
    let canSubmit = false
    if (selectedIndexes.length >= 5 && selectedIndexes.length <= 10) {
      canSubmit = true
    }
    this.setState({
      canSubmit,
    })
  }

  onItemPress = (index: number) => {
    const { selectedIndexes } = this.state
    const itemIndex = selectedIndexes.findIndex((i) => i === index)
    if (itemIndex !== -1) {
      this.setState(
        (prevState) => ({
          selectedIndexes: prevState.selectedIndexes.filter((i) => i !== index),
        }),
        () => {
          this.validate()
        },
      )
    } else {
      this.setState(
        (prevState) => ({
          selectedIndexes: [...prevState.selectedIndexes, index],
        }),
        () => {
          this.validate()
        },
      )
    }
  }

  renderItem = ({ item, index }) => {
    const selected = this.state.selectedIndexes.includes(index)
    return (
      <TopicItem
        data={item}
        selected={selected}
        index={index}
        onPress={this.onItemPress}
      />
    )
  }

  renderItemSeparator = () => {
    return <View style={styles.itemSeparator} />
  }

  renderListHeader = () => {
    return (
      <Text style={styles.instruction}>
        {localizedStrings.followTopics.instruction}
      </Text>
    )
  }

  onWarningModalOkPress = () => {
    this.setState({
      showMaximumTopicsInfoModal: false,
    })
  }

  render() {
    const { topics } = this.props
    const { showMaximumTopicsInfoModal } = this.state
    return (
      <>
        <FlatList
          style={styles.list}
          extraData={this.state.selectedIndexes}
          data={topics}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderItemSeparator}
          ListHeaderComponent={this.renderListHeader}
        />
        <InfoModal
          message={localizedStrings.followTopics.maximumNumberOfTopicsWarning}
          onOkButtonPress={this.onWarningModalOkPress}
          visible={showMaximumTopicsInfoModal}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.white,
  },
  itemSeparator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: COLORS.geyser,
    marginHorizontal: 19,
  },
  instruction: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    marginHorizontal: 19,
    fontWeight: '600',
    marginVertical: 10,
    color: COLORS.doveGray,
  },
  headerNextButton: {
    marginRight: 17,
  },
  headerNextButtonText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.cornFlowerBlue,
  },
  headerNextButtonDisabled: {
    color: COLORS.geyser,
  },
})

export default FollowTopics
