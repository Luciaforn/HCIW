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
  TouchableWithoutFeedback
} from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get the screen height for responsive layout
const { height } = Dimensions.get('window');

// DrinkCard component - a clickable card displaying a drink's name and image
const DrinkCard = ({ name, image, onPress }) => (
  <TouchableOpacity style={styles.drinkCard} onPress={onPress}>
    <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.drinkImage} />
    <Text style={styles.drinkName}>{name}</Text>
  </TouchableOpacity>
);

// Main component
export default function App() {
  const [temperature, setTemperature] = useState(60);

  const [selectedDrink, setSelectedDrink] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [serverTemp, setServerTemp] = useState(null);

  const [tempEdit, setTempEdit] = useState(60);

  const navigation = useNavigation();

  const [esp32Response, setEsp32Response] = useState('');

  const [fontsLoaded] = useFonts({
    'Nunito': require('../assets/Nunito.ttf'),
    'Quicksand': require('../assets/Quicksand.ttf'),
    'Raleway': require('../assets/Raleway.ttf'),
  });

  // Permanently saves the temperature that the user changes
  useEffect(() => {
    const loadDrinks = async () => {
      try {
        const savedDrinks = await AsyncStorage.getItem('@drinks');
        if (savedDrinks !== null) {
          const parsed = JSON.parse(savedDrinks);

          // Verifica che ogni drink abbia un `uid` e `name`
          const isValid = Array.isArray(parsed) &&
            parsed.every(d => typeof d.uid === 'string' && typeof d.name === 'string');

          if (isValid) {
            setDrinks(parsed);
          } else {
            console.warn("Dati corrotti in AsyncStorage, ripristino quelli di default");
            await AsyncStorage.setItem('@drinks', JSON.stringify(defaultDrinks));
            setDrinks(defaultDrinks);
          }
        }
      } catch (e) {
        console.log('Errore nel caricamento dei drink:', e);
        // In caso di errore, fallback
        await AsyncStorage.setItem('@drinks', JSON.stringify(defaultDrinks));
        setDrinks(defaultDrinks);
      }
    };

    loadDrinks();
  }, []);


  // Function to open modal and set selected drink
  const openDrinkModal = (drink) => {
    setSelectedDrink(drink);
    setTempEdit(drink.defaultTemp || 60); // fallback temperature
    setModalVisible(true);
  };

  // List of available drinks with default temperatures and icons
  const defaultDrinks = [
    {
      uid: '1DACB0060A1080',
      name: 'Coffee',
      image: 'https://img.icons8.com/ios-filled/100/espresso-cup.png',
      defaultTemp: 60
    },
    {
      uid: '1DAAB0060A1080',
      name: 'Milk',
      image: 'https://img.icons8.com/ios-filled/100/milk-bottle.png',
      defaultTemp: 50
    },
    {
      uid: '1DABB0060A1080',
      name: 'Tea',
      image: 'https://img.icons8.com/ios-filled/100/tea.png',
      defaultTemp: 65
    },
    {
      uid: '1DA9B0060A1080',
      name: 'Baby bottle',
      image: require('../assets/babyBottleIcon.png'),
      defaultTemp: 37
    },
    {
      uid: 'FFFFFFFFFFFFFF',
      name: 'Chocolate',
      image: 'https://img.icons8.com/ios-filled/100/coffee.png',
      defaultTemp: 55
    }
  ];

  const [drinks, setDrinks] = useState(defaultDrinks);


  // Function to save edited temperature and update drink list
  const saveTemp = async () => {
    if (selectedDrink) {
      try {
        const updatedDrinks = drinks.map((drink) => {
          if (drink.uid === selectedDrink.uid) {
            return { ...drink, defaultTemp: tempEdit };
          }
          return drink;
        });

        setDrinks(updatedDrinks);
        setTemperature(tempEdit);
        setModalVisible(false);

        // Salva nel AsyncStorage i drinks aggiornati
        await AsyncStorage.setItem('@drinks', JSON.stringify(updatedDrinks));

      } catch (e) {
        console.log('Failed to save drinks', e);
      }
    }
  };


  // Navigate to the "Stats" screen
  const onPressStats = () => {
    navigation.navigate('Stats');
  };

  const handleFetchESP32 = () => {
    fetch("http://10.72.66.146/getTemp")
      .then(res => res.json())  
      .then(data => {
        // data = { temperatura: "37" }
        const tempStr = data.temperatura;
        // if you want a string:
        setServerTemp(tempStr);
        // cast in to integer with parseInt, if you want a integer:
        // setServerTemp(parseInt(tempStr, 10));
        
        setEsp32Response('');  
      })
      .catch(err => {
        setEsp32Response("Errore: impossibile contattare ESP32");
        setServerTemp(null);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/backgroundApp.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Stats (menu) button */}
        <TouchableOpacity
          style={styles.statsButton}
          onPress={onPressStats}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.statsButtonContainer}>
            <View style={[styles.statsBar, { height: 10 }]} />
            <View style={[styles.statsBar, { height: 26 }]} />
            <View style={[styles.statsBar, { height: 18 }]} />
          </View>
        </TouchableOpacity>

        {/* Logo section */}
        <View style={styles.spaceForLogo}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>

        {/* My Drinks list */}
        <View style={styles.drinksSection}>
          <Text style={styles.sectionTitle}>My Drink</Text>
          <FlatList
            data={drinks}
            keyExtractor={(item) => item.uid}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            renderItem={({ item }) => (
              <DrinkCard
                name={item.name}
                image={item.image}
                onPress={() => openDrinkModal(item)}
              />
            )}
          />
        </View>


        {/* Cup section with placeholder text and saucer */}
        <TouchableOpacity style={styles.writtenSection} onPress={handleFetchESP32}>
          <Text style={styles.writtenPlace}>Place</Text>
          <Text style={styles.writtenPlace}>your drink</Text>
          <Text style={styles.writtenPlace}>to start!</Text>

          {serverTemp !== null && (
            <Text style={[styles.writtenPlaceContainer, { fontSize: 28, color: '#000', marginTop: 15 }]}>
              Temperatura: {serverTemp}°C
            </Text>
          )}

          {esp32Response !== '' && (
            <Text style={{ fontSize: 16, color: 'red', marginTop: 10 }}>
              {esp32Response}
            </Text>
          )}
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
          {/* Overlay to close modal if tapped outside */}
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              {/* Prevent tap propagation to background */}
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  {selectedDrink && (
                    <>
                      {/* Drink image in modal */}
                      <Image
                        source={
                          typeof selectedDrink.image === 'string'
                            ? { uri: selectedDrink.image }
                            : selectedDrink.image
                        }
                        style={styles.modalImage}
                      />
                      {/* Drink name */}
                      <Text style={styles.modalTitle}>{selectedDrink.name}</Text>
                      <Text style={styles.modalSubtitle}>Ideal temperature</Text>

                      {/* Temperature controls */}
                      <View style={styles.tempControls}>
                        <TouchableOpacity
                          style={styles.tempButton}
                          onPress={() => setTempEdit((prev) => Math.max(0, prev - 1))}
                        >
                          <Text style={styles.tempButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.tempValue}>{tempEdit}°C</Text>
                        <TouchableOpacity
                          style={styles.tempButton}
                          onPress={() => setTempEdit((prev) => prev + 1)}
                        >
                          <Text style={styles.tempButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Save button */}
                      <TouchableOpacity style={styles.saveButton} onPress={saveTemp}>
                        <Text style={styles.saveButtonText}>Save!</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Theme colors
const theme = {
  colorePiuScuro: '#9d724c',
  coloreScuro: '#d9a87c',
  coloreChiaro: '#f5d0ae',
  colorePiuChiaro: '#ffdebf'
};

// Styles
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.coloreScuro
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
    marginBottom: 10,
  },

  drinkName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    fontFamily : "Raleway"
  },

  saucer: {
    position: 'absolute',
    bottom: 85, // o un valore che lo posizioni correttamente
    left: '50%',
    transform: [{ translateX: -150 }], // metà della sua larghezza (300px)
    height: 20,
    width: 300,
  },

  temperatureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //SETTINGS OF THE MODAL CONTENT
  modalContent: { //window that opens if you click one of the drink cards
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },

  modalImage: { //image on the modal content
    width: 80,
    height: 80,
    marginBottom: 15,
  },

  modalTitle: { //drink writing inside model content
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalSubtitle: { //"Ideal temperature"
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },

  tempControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  tempButton: { // circles around the + and -
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.coloreChiaro,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },

  tempButtonText: { //+ and - written
    fontSize: 24,
    fontWeight: 'bold',
  },

  tempValue: { // temperature
    fontSize: 30,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: theme.coloreScuro,
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
  //END SETTINGS MODAL CONTENT

  writtenPlace: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    textAlign: 'left',
    fontFamily: "Nunito",
    marginTop: -5
  },  

    writtenSection: { //"Place your drink to start!"
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 105,
    marginTop: -10,
    width: 300
  },
  
  spaceForLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo:{
    height:120,
    width:120
  }

});
