import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { REPORT_POST_REASONS } from '../../constants'
import localizedStrings from '../../localization'
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import { DefaultButton } from '../../components/DefaultButton'
import InfoModal from '../../components/InfoModal'

interface Props {
  navigation: any
  route: any
  reportPost: (id: string, reason: number) => void
  loading: boolean
  success: boolean
  error: string | null
}

interface State {
  selectedValue: number
  showInfoModal: boolean
  infoModalSettings: {
    title: string
    message: string
  }
}

class ReportPost extends React.Component<Props, State> {
  private options: any[]

  constructor(props: Props) {
    super(props)

    this.state = {
      selectedValue: 0,
      showInfoModal: false,
      infoModalSettings: {
        title: '',
        message: '',
      },
    }

    this.options = [
      {
        label: localizedStrings.reportPost.options.spam,
        value: REPORT_POST_REASONS.SPAM,
      },
      {
        label: localizedStrings.reportPost.options.nudityOrSexualActivity,
        value: REPORT_POST_REASONS.NUDITY_OR_SEXUAL_ACTIVITY,
      },
      {
        label: localizedStrings.reportPost.options.hateSpeechOrSymbols,
        value: REPORT_POST_REASONS.HATE_SPEECH_OR_SYMBOLS,
      },
      {
        label:
          localizedStrings.reportPost.options.violenceOrDangerousOrganizations,
        value: REPORT_POST_REASONS.VIOLENCE_OR_DANGEROUS_ORGANIZATIONS,
      },
      {
        label:
          localizedStrings.reportPost.options.saleOfIllegalOrRegulatedGoods,
        value: REPORT_POST_REASONS.SALE_OF_ILLEGAL_OR_REGULATED_GOODS,
      },
      {
        label: localizedStrings.reportPost.options.bullyingOrHarassment,
        value: REPORT_POST_REASONS.BULLYING_OR_HARASSMENT,
      },
      {
        label:
          localizedStrings.reportPost.options.intellectualPropertyViolation,
        value: REPORT_POST_REASONS.INTELLECTUAL_PROPERTY_VIOLATION,
      },
      {
        label:
          localizedStrings.reportPost.options
            .suicideSelfInjuryOrEatingDisorders,
        value: REPORT_POST_REASONS.SUICIDE_SELF_INJURY_OR_EATING_DISORDERS,
      },
      {
        label: localizedStrings.reportPost.options.scamOrFraud,
        value: REPORT_POST_REASONS.SCAM_OR_FRAUD,
      },
      {
        label: localizedStrings.reportPost.options.falseInformation,
        value: REPORT_POST_REASONS.FALSE_INFORMATION,
      },
    ]
  }

  onSelectedValueChange = (newValue: number) => {
    this.setState({
      selectedValue: newValue,
    })
  }

  onReportButtonPress = () => {
    this.props.reportPost(this.props.route.params.id, this.state.selectedValue)
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (
      !this.props.loading &&
      prevProps.loading !== this.props.loading &&
      this.props.success
    ) {
      this.setState({
        showInfoModal: true,
        infoModalSettings: {
          title: 'Success',
          message: "Thank you for making Flornt's community better!",
        },
      })
    }

    if (
      !this.props.loading &&
      prevProps.loading !== this.props.loading &&
      !this.props.success &&
      this.props.error
    ) {
      this.setState({
        showInfoModal: true,
        infoModalSettings: {
          title: 'Failed',
          message: this.props.error,
        },
      })
    }
  }

  onInfoModalOkButtonPress = () => {
    this.setState(
      {
        showInfoModal: false,
        infoModalSettings: {
          title: '',
          message: '',
        },
      },
      () => {
        this.props.navigation.goBack()
      },
    )
  }

  render() {
    const {
      selectedValue,
      showInfoModal,
      infoModalSettings: { title, message },
    } = this.state

    return (
      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={styles.container}>
          <Text style={styles.questionText}>
            {localizedStrings.reportPost.label}
          </Text>
          {this.options.map((obj, i) => (
            <RadioButton key={i} wrapStyle={styles.radioButton}>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={selectedValue === obj.value}
                onPress={() => this.onSelectedValueChange(obj.value)}
                borderWidth={1}
                buttonInnerColor={COLORS.oceanGreen}
                buttonOuterColor={COLORS.oceanGreen}
                buttonSize={15}
                buttonOuterSize={20}
                buttonStyle={{}}
                buttonWrapStyle={styles.radioButtonInput}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                onPress={() => this.onSelectedValueChange(obj.value)}
                labelStyle={styles.radioButtonLabel}
                labelWrapStyle={{}}
              />
            </RadioButton>
          ))}
          <DefaultButton
            style={styles.reportButton}
            text={localizedStrings.reportPost.reportButton}
            onPress={this.onReportButtonPress}
          />
          <InfoModal
            visible={showInfoModal}
            title={title}
            message={message}
            onOkButtonPress={this.onInfoModalOkButtonPress}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 19,
    paddingVertical: 20,
  },
  radioButton: {
    marginBottom: 10,
  },
  radioButtonInput: {
    marginRight: 10,
  },
  radioButtonLabel: {
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  questionText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 22,
  },
  reportButton: {
    marginTop: 22,
  },
})

export default ReportPost
