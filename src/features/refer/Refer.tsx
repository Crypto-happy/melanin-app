import DefaultInput from 'components/DefaultInput'
import COLORS from 'constants/colors'
import localizedStrings from 'localization'
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import Icon, { IconType } from 'components/Icon/Icon'
import { FONT_FAMILIES } from 'constants/fonts'
import { DefaultButton } from 'components/DefaultButton'
import { pink100 } from 'react-native-paper/lib/typescript/styles/colors'
const windowWidth = Dimensions.get('window').width

interface Props {
  navigation: any
}

interface State {
  formValues: any
}

class ReferScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      formValues: [{ email: '' }],
    }
  }

  componentDidMount() {
    const { navigation } = this.props

    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps) => {
        return (
          <TouchableOpacity
            style={styles.backButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={() => {
              navigation.goBack()
            }}>
            <Icon
              type={IconType.MaterialIcons}
              name={'arrow-back'}
              color={COLORS.black}
              size={30}
            />
          </TouchableOpacity>
        )
      },
    })
  }

  handleChange = (index: number, value: string) => {
    const { formValues } = this.state
    let newFormValues = [...formValues]
    newFormValues[index]['email'] = value
    this.setState({ formValues: newFormValues })
  }

  addFormFields = () => {
    const { formValues } = this.state
    this.setState({ formValues: [...formValues, { email: '' }] })
  }

  removeFormFields = (index: number) => {
    const { formValues } = this.state

    let newFormValues = [...formValues]
    newFormValues.splice(index, 1)
    this.setState({ formValues: newFormValues })
  }

  render() {
    const { formValues } = this.state

    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={false}>
        <View style={styles.content}>
          <Text style={styles.instruction}>
            {localizedStrings.refer.refer_input_instruction}
          </Text>
          {formValues.map((element: any, index: number) => (
            <View style={styles.inputRow}>
              <DefaultInput
                containerStyle={styles.emailInputContainer}
                placeholder={localizedStrings.login.emailInput.placeholder}
                autoFocus={true}
                value={element.email}
                keyboardType={'email-address'}
                onChangeText={(value) => this.handleChange(index, value)}
                autoCapitalize={'none'}
              />

              {index == formValues.length - 1 ? (
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={this.addFormFields}>
                  <Icon
                    type={IconType.FontAwesome}
                    name={'plus'}
                    size={16}
                    color={COLORS.silver}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => this.removeFormFields(index)}>
                  <Icon
                    type={IconType.FontAwesome}
                    name={'minus'}
                    size={16}
                    color={COLORS.silver}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <DefaultButton
            style={styles.viewProductButton}
            text={'Send'}
            onPress={() => {}}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 37,
    alignItems: 'stretch',
    paddingTop: 22,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  emailInputContainer: {
    width: 230,
  },
  itemAction: {
    maxHeight: 26,
  },
  instruction: {
    color: COLORS.black,
    fontSize: 16,
    marginBottom: 15,
  },
  backButton: {
    marginEnd: 17,
    marginStart: 17,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  viewProductButton: {
    width: 150,
    height: 40,
    marginBottom: 20,
  },
})

export default ReferScreen
