/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    Februaru 3, 2021                                    */
/*  Filename:   HomeScreen.js                                       */
/*  Purpose:    This screen allows the user to view their existing  */
/*              collections or to create a new collection. Account  */
/*              details are also shown, such as profile image,      */
/*              followers, and following count.                     */
/*                                                                  */
/********************************************************************/

import React, { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '../components/Themed';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight;

  return (
    <View style={styles.container}>
      <View style={[styles.profileContainer, {paddingTop: topPad }]}>
        <View style={styles.profPicContainer}>
          <Ionicons
            name={"md-contact"}
            size={115}
            color={'gray'} />
        </View>
        <Text style={[styles.profName, {marginBottom: 8}]}>@JohnDoe224</Text>
        <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 8}}>
          <Text style={styles.profNumber}>15 </Text>
          <Text style={[styles.profText, {marginRight: 12}]}>Followers</Text>
          <Text style={styles.profNumber}>48 </Text>
          <Text style={styles.profText}>Following</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center', marginBottom: topPad}}>
          <MaterialCommunityIcons name="calendar-month-outline" size={18} color="#505050" />
          <Text style={styles.profText}> Joined March 2020</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Text style={styles.bigText}>Collections </Text>
        <FontAwesome
			    name={'chevron-right'}
				  size={17}
				  color={'black'}
          style={{ bottom: -1.5, alignSelf: 'center' }} />
        <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent', flexDirection: 'row'}}>
          <Text style={styles.bigText}>Create </Text>
          <FontAwesome
			      name={'plus'}
				    size={17.5}
				    color={'black'}
            style={{ bottom: -1.5, alignSelf: 'center' }} />
        </View>
      </View>

    </View>  // End container view
  );  // End return
}  // End component

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    paddingLeft: (screenWidth < 670 ? 14 : 15),
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingLeft: (screenWidth < 670 ? 14 : 15),
    paddingRight: (screenWidth < 670 ? 14 : 15)
  },
  profName: {
    fontSize: (screenWidth < 670 ? 19 : 23),
    color: 'black',
    fontWeight: 'bold'
  },
  profPicContainer: {
    marginTop: 6,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  profNumber: {
    fontSize: (screenWidth < 670 ? 15 : 18),
    fontWeight: 'bold',
    color: 'black'
  },
  profText: {
    fontSize: (screenWidth < 670 ? 15 : 18),
    color: 'black'
  },
  bigText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'black'
  },
});
