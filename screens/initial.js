/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    October 25, 2020                                    */
/*  Filename:   InitialScreen.js                                    */
/*  Purpose:    This file contains the user sign in screen to       */
/*              log into an existing account. It allows the user    */
/*              to enter their email and password credentials       */
/*              into the input fields.                              */
/*                                                                  */
/********************************************************************/

import * as React from 'react';
import { StyleSheet, AppRegistry, Dimensions, TouchableWithoutFeedback, TouchableOpacity,
          Image, TextInput, Keyboard } from 'react-native';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import store from '../reducer/loginStore';

export default class InitialScreen extends React.Component {
constructor(props) {
  super(props);
  // Subscribe to redux store
  this.unsubscribe = store.subscribe(()=> {
    this.setState(store.getState());
  });
  // Initialize default states
  this.state = {
    userEmail: '', userPass: '', invalidEmail: '',
    invalidPass: '', eyeIcon: "ios-eye", hidden: true,
    invalidCombo: '', buttonDisabled: false, buttonOpacity: 1.0
  };
}  // End constructor

componentWillUnmount() {
  this.unsubscribe();
}

/***********************************************************************/
/*  Function name:  handleEmail                                        */
/*  Description:    Called when user is entering text into the email   */
/*                  input field. Sets the userEmail state.             */
/*                                                                     */
/***********************************************************************/
handleEmail = (text) => {
  this.setState({ userEmail: text.replace(/\s+/g, ''), invalidCombo: '', invalidEmail: '' })
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if ((reg.test(text) === false && text != '') || (this.state.userPass.length < 6 && this.state.userPass != '')
      || (text == '') || (this.state.userPass == '') || (text == undefined) || (text == null) || (this.state.userPass == null)
        || (this.state.userPass == undefined)) {
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
  this.setState({ userPass: text.replace(/\s+/g, ''), invalidCombo: '', invalidPass: '' })
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if ((text.length < 6 && text != '') || (reg.test(this.state.userEmail) === false && this.state.userEmail != '')
      || (text == '') || (this.state.userEmail == '') || (this.state.userEmail == undefined) || (text == undefined) || (text == null)
        || (this.state.userEmail == null)) {
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
/*  Function name:  cleanUp                                            */
/*  Description:    Reset states to default values and unsubscribe     */
/*                  from the redux store. Then navigate to the         */
/*                  create account screen.                             */
/*                                                                     */
/***********************************************************************/
cleanUp = () => {
  this.setState({ userEmail: '', userPass: '', invalidEmail: '',
    invalidPass: '', eyeIcon: "ios-eye", hidden: true,
    invalidCombo: '', buttonDisabled: false, buttonOpacity: 1.0 })
  this.unsubscribe();
  this.props.navigation.navigate('Register')
}

/***********************************************************************/
/*  Function name:  signIn                                             */
/*  Description:    Redux action for dispatching sign in state.        */
/*                  Sets the loginSuccess state to true.               */
/*                  The helper functions above are called for input    */
/*                  validation. Otherwise, the action is dispatched.   */
/*                                                                     */
/***********************************************************************/
signIn = () => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if ((this.state.userPass.length < 6 && this.state.userPass != '') || (reg.test(this.state.userEmail) === false && this.state.userEmail != '')
      || (this.state.userPass == '') || (this.state.userEmail == '') || (this.state.userEmail == undefined) || (this.state.userPass == null)
        || (this.state.userPass == undefined) || (this.state.userEmail == null)) {
    this.emailInput.focus()
  }
  else {
    store.dispatch({
      type: 'SIGN_IN',
      payload: { email: this.state.userEmail  }
    });
  }
}

/* DELETE THIS */
tempAccess = () => {
  store.dispatch({
    type: 'SIGN_IN',
    payload: { email: 'guest'  }
  });
}

render() {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ marginTop: (Platform.OS === 'ios' ? Dimensions.get('window').height*.065 : Dimensions.get('window').height*.05), alignItems: 'center' }}>
          <View style={{ width: '18%', height: Dimensions.get('window').height*.1, marginBottom: Dimensions.get('window').height*.018,
                          marginLeft: Dimensions.get('window').width*.015 }}>
					  <Image source={require('../assets/images/generic.png')}
  	          style={styles.image1} />
				  </View>
				  <View style={{ width: '71%', height: Dimensions.get('window').height*.12 }}>
					  <Image source={require('../assets/images/InitialLogo.png')}
  	          style={styles.image1} />
				  </View> 
			  </View>
      </TouchableWithoutFeedback>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{alignItems: 'center', marginBottom: Dimensions.get('window').height*.01 }}>
          <Text style={styles.title}>COLLECT SOCIALLY</Text>
        </View>
      </TouchableWithoutFeedback>

      {( this.state.invalidEmail != '' ) ? <View style={{ marginBottom: Dimensions.get('window').height*.008 }}></View> : null }

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ alignItems: 'flex-start', marginLeft: Dimensions.get('window').width*.05 }}>
          <Text style={styles.errorText}>{this.state.invalidEmail}</Text>
        </View>      
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ alignItems: 'center' }}>
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
            onChangeText={this.handleEmail}  // Set email state
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
              onSubmitEditing={this.signIn}  // Handle return key
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
        <View style={{ alignItems: 'flex-start' }}>
          <TouchableOpacity
              activeOpacity={'0.7'}
              onPress={this.tempAccess}
            style={{ marginLeft: Dimensions.get('window').width*.05 }}>
            <Text style={{ color: '#4169E1', fontSize: 17 }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View opacity={this.state.buttonOpacity} style={{ alignItems: 'center', marginTop: Dimensions.get('window').height*.03 }}>
          <TouchableOpacity style={styles.button}
            activeOpacity={'0.7'}
            onPress={this.signIn}
            disabled={this.state.buttonDisabled}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height*.03, marginBottom: Dimensions.get('window').height*.08 }}>
        <TouchableWithoutFeedback style={{ alignItems: 'center' }}
            onPress={this.cleanUp}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{ fontSize: Dimensions.get('window').height*.021, color: 'black' }}>Don't have an account? </Text>
            <Text style={{ fontSize: Dimensions.get('window').height*.021, color: '#4169E1' }}>Create account</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      
    </View>  // End container view
  );  // End return
}}  // End render and class

AppRegistry.registerComponent('InitialScreen', () => InitialScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: Dimensions.get('window').height*.025,
    fontWeight: 'bold',
    color: '#202020'
  },
  image1: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
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
    fontSize: 18
  },
  passwordInput: {
    flexDirection: 'row',
    width: '90%',
    height: Dimensions.get('window').height*.044,
    borderColor: 'black',
    borderBottomWidth: 1
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
