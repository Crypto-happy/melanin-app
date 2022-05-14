import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'

import localizedStrings from 'localization'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { get } from 'lodash'
const { width } = Dimensions.get('window')

interface Props {
  navigation: any
  getLoyaltyTokens: () => void
  loyaltyTokens: Object
  totalLoyaltyTokens: number
}

interface State {}

class EarningsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    const { getLoyaltyTokens } = this.props

    getLoyaltyTokens()
  }

  private tokenLabels = [
    'accountActivation',
    'likePost',
    'internalSharePost',
    'externalSharePost',
    'commendPost',
    'imageUpload',
    'videoUpload',
    'accountReferral',
    'airdrop',
    'reflection',
  ]
  private maxTokensInfo = [
    {
      label: localizedStrings.earnings.tokenLabels.accountActivation,
      value: 1,
    },

    {
      label: localizedStrings.earnings.tokenLabels.personalReferral,
      value: 10,
    },
    {
      label: localizedStrings.earnings.tokenLabels.businessReferral,
      value: 16,
    },
  ]

  private comingSoonFeatures = ['airdrop', 'reflection']

  getTokenValue = (token: string) => {
    const { loyaltyTokens } = this.props

    return get(loyaltyTokens[token], 'value', 0)
  }

  render() {
    const { totalLoyaltyTokens } = this.props
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.totalToken}>
            Total Earnings = {totalLoyaltyTokens} MPT {'\n'}
            (MelaninPeople Tokens)
          </Text>
          <View style={styles.listItemWrapper}>
            <Text style={styles.itemHeader}>
              {localizedStrings.earnings.tableHeaderActivity}
            </Text>
            <Text style={styles.itemHeader}>
              {localizedStrings.earnings.tableHeaderEarnings}
            </Text>
          </View>
          {this.tokenLabels.map((label, index) => (
            <View key={index} style={styles.listItemWrapper}>
              <Text style={styles.itemName}>
                {localizedStrings.earnings.tokenLabels[label]}
              </Text>

              {this.comingSoonFeatures.includes(label) ? (
                <Text style={styles.comingSoonItem}>..Coming soon</Text>
              ) : (
                <Text style={styles.itemAction}>
                  {this.getTokenValue(label)}
                </Text>
              )}
            </View>
          ))}

          <View style={styles.maxTokenInfo}>
            <Text style={styles.maxTokenTitle}>
              {localizedStrings.earnings.maxTokensHeader}
            </Text>

            {this.maxTokensInfo.map((tokenInfo, index) => (
              <View key={index} style={styles.listItemWrapper}>
                <Text style={styles.itemName}>{tokenInfo.label}</Text>
                <Text style={styles.itemAction}>{tokenInfo.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  maxTokenInfo: {
    alignItems: 'center',
    marginTop: 30,
  },
  maxTokenText: {
    fontSize: 14,
    marginVertical: 5,
  },
  maxTokenTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  totalToken: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 15,
    marginVertical: 30,
  },
  listItemWrapper: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: width * 0.6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.alabaster,
  },

  itemName: {
    flex: 1,
  },
  itemAction: {
    maxHeight: 26,
  },
  comingSoonItem: {
    maxHeight: 26,
    fontStyle: 'italic',
  },
  itemHeader: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})

export default EarningsScreen
