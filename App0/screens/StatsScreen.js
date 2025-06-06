import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const backIconColor = '#000';

// Mock data for chart demonstration
const weeklyMockData = {
  Coffee: { before: { count: 3, delta: 5 }, after: { count: 7, delta: -3 } },
  Tea: { before: { count: 2, delta: 6 }, after: { count: 5, delta: -2 } },
  Milk: { before: { count: 1, delta: 4 }, after: { count: 4, delta: -2 } },
  'Baby Bottle': { before: { count: 2, delta: 3.5 }, after: { count: 3, delta: -2.1 } },
  Chocolate: { before: { count: 4, delta: 5.5 }, after: { count: 6, delta: -3.2 } },
};

const totalMockData = {
  Coffee: { before: { count: 8, delta: 5.2 }, after: { count: 12, delta: 3.1 } },
  Tea: { before: { count: 5, delta: 6.0 }, after: { count: 10, delta: 2.8 } },
  Milk: { before: { count: 3, delta: 4.0 }, after: { count: 7, delta: 2.5 } },
  'Baby Bottle': { before: { count: 5, delta: 3.7 }, after: { count: 7, delta: 2.0 } },
  Chocolate: { before: { count: 6, delta: 5.1 }, after: { count: 9, delta: 3.3 } },
};

export default function StatsScreen() {
  const navigation = useNavigation();

  // Drink dropdown state
  const [isDrinkDropdownOpen, setIsDrinkDropdownOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState('Coffee');
  const [drinkOptions, setDrinkOptions] = useState([
    { label: 'Coffee', value: 'Coffee' },
    { label: 'Tea', value: 'Tea' },
    { label: 'Milk', value: 'Milk' },
    { label: 'Baby Bottle', value: 'Baby Bottle' },
    { label: 'Chocolate', value: 'Chocolate' },
  ]);

  // Period dropdown state
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Last week');
  const [periodOptions, setPeriodOptions] = useState([
    { label: 'Last week', value: 'Last week' },
    { label: 'Total', value: 'Total' },
  ]);

  // Select appropriate data based on period
  const selectedDataSource = selectedPeriod === 'Last week' ? weeklyMockData : totalMockData;
  const drinkData = selectedDataSource[selectedDrink];

  const chartData = {
    labels: ['Before', 'After'],
    datasets: [
      {
        data: [drinkData.before.count, drinkData.after.count],
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color={backIconColor} />
        <Text style={[styles.backText, { color: backIconColor }]}>Home</Text>
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Temperature Stats</Text>
      </View>

      {/* Drink picker */}
      <View style={styles.drinkPicker}>
        <DropDownPicker
          open={isDrinkDropdownOpen}
          value={selectedDrink}
          items={drinkOptions}
          setOpen={setIsDrinkDropdownOpen}
          setValue={setSelectedDrink}
          setItems={setDrinkOptions}
          placeholder="Select a drink"
          containerStyle={{ height: 50 }}
          style={{
            backgroundColor: theme.darkColor,
            borderWidth: 0,
            elevation: 2,
          }}
          dropDownContainerStyle={{
            backgroundColor: 'rgb(223, 179, 140)',
            borderWidth: 0,
            elevation: 2,
          }}
          textStyle={{
            color: 'rgb(65, 65, 65)',
            fontWeight: '500',
          }}
          labelStyle={{
            color: 'black',
          }}
        />
      </View>

      {/* Period picker */}
      <View style={styles.periodPicker}>
        <DropDownPicker
          open={isPeriodDropdownOpen}
          value={selectedPeriod}
          items={periodOptions}
          setOpen={setIsPeriodDropdownOpen}
          setValue={setSelectedPeriod}
          setItems={setPeriodOptions}
          placeholder="Select a period"
          containerStyle={{ height: 50 }}
          style={{
            backgroundColor: theme.lightColor,
            borderWidth: 0,
            borderRadius: 8,
          }}
          dropDownContainerStyle={{
            backgroundColor: 'rgb(249, 218, 188)',
            borderWidth: 0,
            borderRadius: 8,
          }}
          textStyle={{
            color: 'rgb(65, 65, 65)',
            fontWeight: '500',
          }}
          labelStyle={{
            color: 'black',
          }}
        />
      </View>

      {/* Chart title */}
      <Text style={styles.chartTitle}>
        Usage of {selectedDrink} - {selectedPeriod}
      </Text>

      {/* Bar chart */}
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: theme.lighterColor1,
          backgroundGradientTo: theme.lighterColor1,
          decimalPlaces: 0,
          color: () => "#000",
        }}
        style={styles.chart}
        fromZero
      />

      {/* Delta info */}
      <View style={styles.deltaContainer}>
        <Text style={styles.deltaText}>Average delta before: {drinkData.before.delta}°C</Text>
        <Text style={styles.deltaText}>Average delta after: {drinkData.after.delta}°C</Text>
      </View>
    </View>
  );
}

// Theme colors
const theme = {
  darkestColor: '#9d724c',
  darkColor: '#d9a87c',
  lightColor: '#f5d0ae',
  lighterColor: '#ffdebf',
  lighterColor1 : '#ffeede'
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lighterColor1,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 2,
  },
  titleContainer: {
    marginTop: 130,
    marginLeft: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  drinkPicker: {
    zIndex: 1000,
    marginTop: 25,
    marginBottom: 10,
  },
  periodPicker: {
    zIndex: 999,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 23,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  chart: {
    borderRadius: 8,
  },
  deltaContainer: {
    marginTop: 20,
  },
  deltaText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});
