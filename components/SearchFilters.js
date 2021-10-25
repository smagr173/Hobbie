/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    June 9, 2021                                        */
/*  Filename:   SearchFilters.js                                    */
/*  Purpose:    Used in MapScreen and DiscoverScreen. Reusable      */
/*              component for search filter buttons.                */
/*                                                                  */
/********************************************************************/

import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const FiltersComponent = (props) => {
  return (
    <View style={styles.searchButton}>
      <TouchableOpacity onPress={props.onPress}>
        <View style={styles.innerContainer}>
          <Text style={[ styles.buttonText, { color: props.textColor } ]}>{props.category}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default FiltersComponent;

const styles = StyleSheet.create({
  searchButton: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: (screenWidth < 670 ? 16 : 19),
  },
  innerContainer: {
    paddingLeft: (screenWidth < 670 ? 10 : 15),
    paddingRight: (screenWidth < 670 ? 10 : 15),
    height: (screenWidth < 670 ? 34.5 : 42),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
