/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    June 27, 2021                                       */
/*  Filename:   SearchBar.js                                        */
/*  Purpose:    Used in MapScreen and DiscoverScreen. Reusable      */
/*              component for search bar.                           */
/*                                                                  */
/********************************************************************/

import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';

const SearchBarComponent = (props) => {
  // State for whether or not the textInput is focused or not
  const [isInputFocused, setIsFocused] = useState(null);
  // State for rendering the real textInput (true) or the fake input field (false)
  const [isRendered, setIsRendered] = useState(false);
  
  const searchRef = useRef(null);

  const handleCancel = () => {
    props.clearSearch()
    setIsFocused(false)
    setIsRendered(false)
  }

  const handlePress = () => {
    setIsRendered(true)
    setIsFocused(true)
    props.onPress()
  }

  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={styles.searchBar}>
          <View style={styles.searchIconContainer}>
            <FontAwesome
              name={'search'}
              size={(screenWidth < 670 ? 17 : 23)}
              color={'#787878'} />
          </View>
          {isRendered ?
            <View style={styles.textInputContainer}>
              <TextInput
                autoCorrect={false}
                placeholder={props.placeHold}
                style={styles.textFieldStyle}
                value={props.searchInput}
                onBlur={() => setIsRendered(false)}
                onChangeText={props.handleSearch}
                ref={searchRef}
                onLayout={() => {searchRef.current.focus()}} />
            </View>
          : null}
        </Animated.View>
      </TouchableOpacity>
    </View>  // End searchBarContainer view
  );
}

export default SearchBarComponent;

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    paddingLeft: (screenWidth < 670 ? 14 : 15),
    paddingRight: (screenWidth < 670 ? 14 : 15),
    backgroundColor: 'transparent',
    paddingBottom: (screenWidth < 670 ? 2 : 8)
  },
  searchBar: {
    flex: 1,
    height: (screenWidth < 670 ? 37 : 45),
    flexDirection: 'row',
    borderRadius: 10
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingRight: (screenWidth < 670 ? 12 : 17)
  },
  fakeInputContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingRight: (screenWidth < 670 ? 10 : 15)
  },  
  textFieldStyle: {
    flex: 1,
    fontSize: (screenWidth < 670 ? 18 : 20),
    backgroundColor: 'transparent',
  },
});
