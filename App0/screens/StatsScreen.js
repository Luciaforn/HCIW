import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Svg, { Polygon } from 'react-native-svg';
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
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const backIconColor = '#000';
const { height } = Dimensions.get('window'); //cambiato
const DrinkCard = ({ name, image, onPress }) => (
  <TouchableOpacity style={styles.drinkCard} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.drinkImage} />
    <Text style={styles.drinkName}>{name}</Text>
  </TouchableOpacity>
);

export default function StatsScreen() {
  const navigation = useNavigation();
  const [temperature, setTemperature] = useState(60);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [serverTemp, setServerTemp] = useState(null);
    const [tempEdit, setTempEdit] = useState(60);
    const [overlayWidth, setOverlayWidth] = useState(0); 
    const [showTemperature, setShowTemperature] = useState(false);
    const [detectedDrink, setDetectedDrink] = useState(null);
    const [fontsLoaded] = useFonts({
      'Nunito': require('../assets/Nunito.ttf'),
      'Quicksand': require('../assets/Quicksand.ttf'),
      'Raleway': require('../assets/Raleway.ttf'),
      'Jersey': require('../assets/Jersey.ttf')
      });
// List of available drinks with default temperatures and icons

  // Timer to hide the temperature after 3 second
  useEffect(() => {
    if (showTemperature) {
      const timer = setTimeout(() => {
        setShowTemperature(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showTemperature]);


  // Function to open modal and set selected drink
  const openDrinkModal = (drink) => {
    setSelectedDrink(drink);
    setTempEdit(drink.defaultTemp || 60);
    setModalVisible(true);
  };


  return (
   <SafeAreaView style={styles.container}>
         <ImageBackground
           source={require('../assets/backgroundApp.jpg')}
           style={styles.background}
           resizeMode="cover"
         >
  
   
           {/* Logo section */}
           <View style={styles.spaceForLogo}>
             <Image style={styles.logo} source={require('../assets/logo.png')} />
           </View>
   
           {/* Cup section with detected drink info */}
           <TouchableOpacity style={styles.writtenSection}> 
   
                <View style={styles.imageContainer}>
                   <TouchableOpacity>
                     <Image 
                       source={require('../assets/milk.png')}
                       style={styles.detectedDrinkImage}/> 
                   </TouchableOpacity>
                   
                   {/* cambiato da 411 a 432*/}
                   {showTemperature && serverTemp !== null && (
                     <View style={[styles.overlayTemperatureContainer,
                       {
                         transform: [
                           { translateX: -overlayWidth / 2 }
                         ]
                       },
                       {backgroundColor: changeColor(serverTemp)}
                     ]}> 
                       <Text style={styles.overlayTemperatureText}>
                         {serverTemp}°C 
                       </Text>
                     </View>
                   )}
                 </View>
           </TouchableOpacity>
   
           <Svg style={styles.saucer}>
             <Polygon
               points="50,20 250,20 270,0 30,0"
               fill="#000"
             />
           </Svg>
   
           {/* Modal to edit temperature of selected drink */}
           <Modal
             visible={modalVisible}
             animationType="fade"
             transparent
             onRequestClose={() => setModalVisible(false)}
           >
           </Modal>
         </ImageBackground>
       </SafeAreaView>
  );
}

const theme = {
  darkestColor: '#9d724c',
  darkColor: '#d9a87c',
  lightColor: '#f5d0ae',
  lighterColor: '#ffdebf'
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.darkColor
  },
  
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },

  statsButton: {
    position: 'absolute',
    top: 10,
    right: 30,
    width: 30,
    height: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },

  statsButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
  },

  statsBar: {
    width: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    marginHorizontal: 2,
  },

  connectionStatus: {
    position: 'absolute',
    top: 15,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    marginTop:370
  },

  statusText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginTop:370
  },

  sectionTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginLeft: 30,
    marginBottom: 15,
    fontFamily: 'Nunito'
  },

  drinkCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 140,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  drinkImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },

  drinkName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: "Raleway"
  },

  saucer: {
    position: 'absolute',
    bottom: 85,
    left: '50%',
    transform: [{ translateX: -150 }],
    height: 20,
    width: 300,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },

  modalImage: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },

  tempControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  tempButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.lightColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },

  tempButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  tempValue: {
    fontSize: 30,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: theme.darkColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    width: 90
  },

  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },

  writtenPlace: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    textAlign: 'left',
    fontFamily: "Nunito",
    marginTop: -7
  },  

  writtenSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',  // ✅ centra orizzontalmente
      marginTop: -10,
      width: '100%',         // ✅ occupa tutta la larghezza
      marginLeft: 0 
  },

  requiredTemperature: { 
    fontSize: 28, 
    color: '#000', 
    marginTop: 15,
    backgroundColor: '#fff',
    width: 200
  },

  //container of the image of the nfc
  //cambiato
  imageContainer: { 
    position: 'relative',
    alignItems: 'center', 
    width: '100%',
},

  //cambiato
  overlayTemperatureContainer: {
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

  //cambiato
  overlayTemperatureText: {
    fontSize: 27,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    //fontFamily: 'Jersey',
    fontFamily: "Digital"
  },

  //Error messages
  responseText: { 
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    textAlign: 'left',
  },

detectedDrinkImage: {
  width: 230,
  height: 230,
  bottom: -105
},
  
  spaceForLogo: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    height: 120,
    width: 120
  }
});