/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    Januaray 15, 2021                                   */
/*  Filename:   RegisterScreen.js                                   */
/*  Purpose:    This file contains the user register screen to      */
/*              create a new account. There are several input       */
/*              fields such as email, username, and password.       */
/*                                                                  */
/********************************************************************/

import * as React from 'react';
import { StyleSheet, AppRegistry, Dimensions, TouchableWithoutFeedback,
          TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import store from '../reducer/loginStore';

export default class RegisterScreen extends React.Component {
constructor(props) {
  super(props);
  // Subscribe to redux store
  this.unsubscribe = store.subscribe(()=> {
    this.setState( store.getState() );
  });
  // Initialize default states
  this.state = {
    username: '', userEmail: '', userPass: '', invalidEmail: '',
    invalidUsername: '', invalidPass: '', eyeIcon: "ios-eye",
    buttonDisabled: false, buttonOpacity: 1.0, hidden: true
  };
}  // End constructor

componentWillUnmount() {
  this.unsubscribe();
}

/***********************************************************************/
/*  Function name:  handleUsername                                     */
/*  Description:    Called when user is entering text into the         */
/*                  username input field. Sets the username state.     */
/*                                                                     */
/***********************************************************************/
handleUsername = (text) => {
  this.setState({ username: text.replace(/\s|\-|\!|\@|\#|\$|\~|\`|\%|\^|\&|\*|\(|\)|\-|\+|\=|\||\[|\]|\{|\}|\;|\:|\'|\"|\\|\,|\<|\.|\>|\/|\?/g, ''),
    invalidUsername: '' })
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if ((text.length < 3 && text != '') || (reg.test(this.state.userEmail) === false && this.state.userEmail != '')
      || (text == '') || (this.state.userEmail == '') || (this.state.userPass == '') || (this.state.userPass.length < 6 && this.state.userPass != '')) {
    this.setState({ buttonDisabled: true, buttonOpacity: 0.5 })
  }
  else {
    this.setState({ buttonDisabled: false, buttonOpacity: 1.0 })
  }
}

/***********************************************************************/
/*  Function name:  handleEmail                                        */
/*  Description:    Called when user is entering text into the email   */
/*                  input field. Sets the userEmail state.             */
/*                                                                     */
/***********************************************************************/
handleEmail = (text) => {
  this.setState({ userEmail: text.replace(/\s+/g, ''), invalidEmail: '' })
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if ((reg.test(text) === false && text != '') || (this.state.userPass.length < 6 && this.state.userPass != '')
      || (text == '') || (this.state.userPass == '') || (this.state.username == '') || (this.state.username.length < 3 && this.state.username.length != '')) {
    this.setState({ buttonDisabled: true, buttonOpacity: 0.5 })
  }
  else {
    this.setState({ buttonDisabled: false, buttonOpacity: 1.0 })
  }
}

/***********************************************************************/
/*  Function name:  handlePass                                         */
/*  Description:    Called when user is entering text into the         */
/*                  password input field. Sets the userPass state      */
/*                  and handles the sign in button.                    */
/*                                                                     */
/***********************************************************************/
handlePass = (text) => {
  this.setState({ userPass: text.replace(/\s+/g, ''), invalidPass: '' })
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if ((text.length < 6 && text != '') || (reg.test(this.state.userEmail) === false && this.state.userEmail != '')
      || (text == '') || (this.state.userEmail == '') || (this.state.username == '') || (this.state.username.length < 3 && this.state.username.length != '')) {
    this.setState({ buttonDisabled: true, buttonOpacity: 0.5 })
  }
  else {
    this.setState({ buttonDisabled: false, buttonOpacity: 1.0 })
  }
}

/***********************************************************************/
/*  Function name:  handleIcon                                         */
/*  Description:    Helper function for the hidden or shown password   */
/*                  icon located within the password input field.      */
/*                                                                     */
/***********************************************************************/
handleIcon = () => {
  this.state.eyeIcon != "ios-eye-off"
    ? this.setState({ eyeIcon: "ios-eye-off", hidden: false })
    : this.setState({ eyeIcon: "ios-eye", hidden: true })
    this.passwordInput.focus()
}

/***********************************************************************/
/*  Function name:  checkPassLength                                    */
/*  Description:    Validates the password input by checking for a     */
/*                  password length of at least 6 characters.          */
/*                  Otherwise, an error message is displayed.          */
/*                                                                     */
/***********************************************************************/
checkPassLength = () => {
  if (this.state.userPass.length < 6 && this.state.userPass != '') {
    this.setState({ invalidPass: 'Password must be at least 6 characters' })
  }
  else {
    this.setState({ invalidPass: '' })
  }
}

/***********************************************************************/
/*  Function name:  checkEmail                                         */
/*  Description:    Validates the email input by checking the input    */
/*                  against a regular expression. If the input is      */
/*                  not accepted an error message is displayed.        */
/*                                                                     */
/***********************************************************************/
checkEmail = () => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if (reg.test(this.state.userEmail) === false && this.state.userEmail != '') {
    this.setState({ invalidEmail: 'Email address must be valid' })
  }
  else {
    this.setState({ invalidEmail: '' })
  }
}

/***********************************************************************/
/*  Function name:  checkUsername                                      */
/*  Description:    Validates the username input by checking the       */
/*                  input length. If the input is less than 3 chars    */
/*                  it is not accepted and a message is displayed.     */
/*                                                                     */
/***********************************************************************/
checkUsername = () => {
  if (this.state.username.length < 3 && this.state.username.length != '') {
    this.setState({ invalidUsername: 'Username must be at least three characters in length' })
  }
  else {
    this.setState({ invalidUsername: '' })
  }
}

/***********************************************************************/
/*  Function name:  cleanUp                                            */
/*  Description:    Reset states to default values and unsubscribe     */
/*                  from the redux store. Then navigate to the         */
/*                  sign in screen.                                    */
/*                                                                     */
/***********************************************************************/
cleanUp = () => {
  this.setState({ username: '', userEmail: '', userPass: '', invalidEmail: '',
    invalidUsername: '', invalidPass: '', eyeIcon: "ios-eye",
    buttonDisabled: false, buttonOpacity: 1.0, hidden: true })
  this.unsubscribe();
  this.props.navigation.navigate('Initial')
}

/***********************************************************************/
/*  Function name:  createAccount                                      */
/*  Description:    Once all inputs are validated, the redux action    */
/*                  is dispatched. User is then taken to sign in       */
/*                  screen where they can enter their credentials.     */
/*                                                                     */
/***********************************************************************/
createAccount = () => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if ((this.state.userPass.length < 6 && this.state.userPass != '') || (reg.test(this.state.userEmail) === false && this.state.userEmail != '')
      || (this.state.userPass == '') || (this.state.userEmail == '') || (this.state.username.length < 3 && this.state.username.length != '')
        || (this.state.username == '')) {
    this.usernameInput.focus()
  }
  else {
    store.dispatch({
      type: 'REGISTER',
      payload: { email: this.state.userEmail, user: this.state.username  }
    });
  }
}

render() {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{alignItems: 'flex-start', marginTop: Dimensions.get('window').height*.03, marginLeft: Dimensions.get('window').width*.05 }}>
          <Text style={styles.title}>Join the Hobbie community</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback>
        <View style={{alignItems: 'flex-start', marginTop: Dimensions.get('window').height*.004, marginLeft: Dimensions.get('window').width*.05 }}>
          <Text style={styles.subTitle}>Organize and share collections</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height*.03 }}>
          <TextInput   // Start username input field
            autoCorrect={false}
            placeholder={'Username'}
            placeholderTextColor={'#606060'}
            maxLength={50}
            returnKeyLabel={'next'}
            returnKeyType={'next'}
            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
            style={styles.inputField}	
            underlineColorAndroid="transparent"
            value={this.state.username}
            onChangeText={this.handleUsername}  // Set username state
            onEndEditing={() => this.checkUsername()}  // Validate input
            onSubmitEditing={() => this.emailInput.focus()}  // Handle return key
            ref={(input) => { this.usernameInput = input }} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height*.03 }}>
          <TextInput   // Start email input field
            autoCorrect={false}
            autoCapitalize={'none'}
            placeholder={'Email'}
            placeholderTextColor={'#606060'}
            maxLength={300}
            returnKeyLabel={'next'}
            returnKeyType={'next'}
            keyboardType={'email-address'}
            selectionColor={'#4169E1'}
            style={styles.inputField}	
            underlineColorAndroid="transparent"
            value={this.state.userEmail}
            onChangeText={this.handleEmail}   // Set email state
            onEndEditing={() => this.checkEmail()}  // Validate input
            onSubmitEditing={() => this.passwordInput.focus()}  // Handle return key
            ref={(input) => { this.emailInput = input }} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height*.03, marginBottom: Dimensions.get('window').height*.03 }}>
          <View style={styles.passwordInput}>
            <TextInput   // Start password input field
              autoCorrect={false}
              placeholder={'Password'}
              placeholderTextColor={'#606060'}
              secureTextEntry={this.state.hidden}
              maxLength={128}
              returnKeyLabel={'go'}
              returnKeyType={'go'}
              selectionColor={'#4169E1'}
              style={{flex: 1, fontSize: 18}}
              underlineColorAndroid="transparent"
              value={this.state.userPass}
              onChangeText={this.handlePass}  // Set password state
              onEndEditing={() => this.checkPassLength()}  // Validate input
              onSubmitEditing={this.createAccount}  // Handle return key
              ref={(input) => { this.passwordInput = input }} />
            <TouchableWithoutFeedback onPress={() => this.handleIcon()} accessible={false}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={this.state.eyeIcon}
                  size={Dimensions.get('window').height*.04}
                  color={'red'}
                  style={{ backgroundColor: 'transparent' }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View opacity={this.state.buttonOpacity} style={{ alignItems: 'center', marginTop: Dimensions.get('window').height*.03 }}>
          <TouchableOpacity style={styles.button}
            activeOpacity={'0.7'}
            onPress={this.createAccount}
            disabled={this.state.buttonDisabled}>
            <Text style={styles.buttonText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height*.03 }}>
        <TouchableWithoutFeedback style={{ alignItems: 'center' }}
            onPress={this.cleanUp}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{ fontSize: Dimensions.get('window').height*.021, color: 'black' }}>Already have an account? </Text>
            <Text style={{ fontSize: Dimensions.get('window').height*.021, color: '#4169E1' }}>Sign in</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ width: '100%', height: '100%' }}></View>
      </TouchableWithoutFeedback>

    </View>  // End container view
  );  // End return
}}  // End render and class

AppRegistry.registerComponent('RegisterScreen', () => RegisterScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: Dimensions.get('window').height*.03,
    fontWeight: 'bold',
    color: '#ED3215'
  },
  subTitle: {
    fontSize: Dimensions.get('window').height*.022,
    color: 'black'
  },
  button: {
		width: '90%',
		height: Dimensions.get('window').height*.067,
		justifyContent: 'center',
    backgroundColor: '#181818',
    borderRadius: Dimensions.get('window').height*.015
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: Dimensions.get('window').height*.022,
  },
  inputField: {
    width: '90%',
    height: Dimensions.get('window').height*.044,
    borderColor: 'black',
    borderBottomWidth: 1,
    fontSize: 18,
  },
  passwordInput: {
    flexDirection: 'row',
    width: '90%',
    height: Dimensions.get('window').height*.044,
    borderColor: 'black',
    borderBottomWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: Dimensions.get('window').height*.021,
  },
  iconContainer: {
    height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
});
