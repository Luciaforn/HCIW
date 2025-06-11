import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { BarChart } from 'react-native-chart-kit';
import { useFonts } from 'expo-font';


import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const backIconColor = '#000';


export default function StatsScreen() {
  const navigation = useNavigation();
  const [overlayWidth, setOverlayWidth] = useState(0); //agg
  const idealTemperature = 30;
  const temperature = 20;
  const [showOverlay, setShowOverlay] = useState(false);
  const handleImagePress = () => {
    setShowOverlay(true);
  };
  const [fontsLoaded] = useFonts({
    'Nunito': require('../assets/Nunito.ttf'),
    'Quicksand': require('../assets/Quicksand.ttf'),
    'Raleway': require('../assets/Raleway.ttf'),
    'Jersey': require('../assets/Jersey.ttf')
    });

    function changeColor(tempStr){
      if(tempStr > idealTemperature)
      {
        return 'red';
      }
      else if(tempStr < idealTemperature)
      {
        return 'dodgerblue';
      }
      else
        return 'green';
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.topText}>Messaggio da ESP32 (statico)</Text>
      </View>

      <View style={styles.imageWrapper}>
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={require('../assets/babyBottle.png')} // <-- cambia percorso se serve
            style={styles.image}
          />
        </TouchableOpacity>

        {showOverlay && (
          <View //agg da qui fino a 71
            style={[
              styles.overlay,
              {
                transform: [
                  { translateX: -overlayWidth / 2 }, 
                ]
              },
              {backgroundColor:changeColor(temperature)}
            ]}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setOverlayWidth(width);
            }}
          > 
  <Text style={styles.overlayText}>{temperature}°C</Text>
</View>

        )}
      </View>
    </SafeAreaView>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 30,
  },
  topText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center', // 👈 centra il contenuto orizzontalmente nel container
    width: '100%',  },

  image: {
    width: 200,
    height: 200,
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateY: -15 }], // todo : centra verticalmente dove dovrebbe essere
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: '#000',
    borderWidth: 2.2,
    opacity: 0.8
  },

  overlayText: {
    fontSize: 27,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: "Digital",
  },
});
/*


export default function App() {

  

  

const styles = StyleSheet.create({
  

*/