import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import Nav from "../../components/nav";

const screenWidth = Dimensions.get('window').width;

const fitnessData = {
  user: {
    name: "Priyanshu Das",
  },
  caloriesBurned: 0,
  caloriesGoal: 500,
  weeklyProgress: [
    { day: "Mon", calories: 300 },
    { day: "Tue", calories: 250 },
    { day: "Wed", calories: 400 },
    { day: "Thu", calories: 450 },
    { day: "Fri", calories: 320 },
    { day: "Sat", calories: 380 },
    { day: "Sun", calories: 450 },
  ],
};

export default function Dashboard() {
  const [stepCount, setStepCount] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener>;
    let lastMagnitude = 0;
    let stepThreshold = 1; // Adjust this value to fine-tune step detection sensitivity
    let stepCooldown = 0;

    const startAccelerometerUpdates = async () => {
      Accelerometer.setUpdateInterval(100); // Update every 100ms

      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        if (stepCooldown > 0) {
          stepCooldown--;
        } else if (magnitude > lastMagnitude + stepThreshold) {
          setStepCount(prevCount => {
            const newCount = prevCount + 1;
            console.log(`Step detected! Total steps: ${newCount}`);
            updateCaloriesBurned(1);
            return newCount;
          });
          stepCooldown = 10; // Wait for 1 second (10 * 100ms) before detecting the next step
        }

        lastMagnitude = magnitude;
      });

      console.log("Accelerometer updates started");
    };

    const updateCaloriesBurned = (steps: number) => {
      const weight = 70; // kg
      const caloriesPerStep = 0.04; // Approximate calories burned per step
      const newCaloriesBurned = steps * caloriesPerStep;
      setCaloriesBurned(prevCalories => {
        const updatedCalories = prevCalories + newCaloriesBurned;
        console.log(`Updated calories burned: ${updatedCalories.toFixed(2)}`);
        return updatedCalories;
      });
    };

    startAccelerometerUpdates();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Current step count: ${stepCount}`);
      console.log(`Current calories burned: ${caloriesBurned.toFixed(2)}`);
    }, 5000);

    return () => clearInterval(interval);
  }, [stepCount, caloriesBurned]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation: Location.LocationObject = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } else {
        console.log("Permission to access location was denied.");
      }
      setLoadingLocation(false);
    })();
  }, []);

  // Calculate distance from steps (in kilometers)
  const calculateDistance = (steps: number) => {
    const strideLength = 0.762; // Average stride length in meters (approx. 2.5 feet)
    const distanceInMeters = steps * strideLength; // Calculate distance in meters
    const distanceInKilometers = distanceInMeters / 1000; // Convert to kilometers
    return distanceInKilometers.toFixed(2); // Return distance in kilometers
  };

  const data = {
    labels: fitnessData.weeklyProgress.map((day) => day.day),
    datasets: [
      {
        data: fitnessData.weeklyProgress.map((day) => day.calories),
      },
    ],
  };

  return (
    <LinearGradient
      colors={['#001F3F', '#005F7F', '#0096D6']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <View style={styles.nameContainer}>
                <Ionicons name="sunny" size={20} color="#FFD700" />
                <Text style={styles.nameText}>{fitnessData.user.name}</Text>
              </View>
            </View>
          </View>
          {loadingLocation ? (
            <ActivityIndicator size="small" color="#FFD700" />
          ) : (
            location && (
              <Text style={styles.locationText}>
                Location: {location.coords.latitude.toFixed(2)}, {location.coords.longitude.toFixed(2)}
              </Text>
            )
          )}
        </View>

        <View style={styles.sensorContainer}>
          <Text style={styles.sensorText}>Steps: {stepCount}</Text>
          <Text style={styles.sensorValue}>Calories Burned: {caloriesBurned.toFixed(2)} kcal</Text>
          <Text style={styles.sensorValue}>Distance: {calculateDistance(stepCount)} km</Text>
        </View>

        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesNumber}>{caloriesBurned.toFixed(2)}</Text>
          <Text style={styles.caloriesText}>Calories Burned</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${(caloriesBurned / fitnessData.caloriesGoal) * 100}%` }]}
              />
            </View>
          </View>
        </View>

        <View style={styles.weekContainer}>
          <View style={styles.weekHeader}>
            <Ionicons name="trending-up" size={20} color="#90C3F9" />
            <Text style={styles.weekText}>Week</Text>
          </View>
          <View style={styles.graphContainer}>
            <LineChart
              data={data}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(144, 195, 249, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#90C3F9',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withVerticalLines={false}
              withHorizontalLines={false}
            />
          </View>
        </View>
      </ScrollView>

      <Nav />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  nameText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  locationText: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 10,
  },
  sensorContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sensorText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  sensorValue: {
    fontSize: 16,
    color: '#fff',
  },
  caloriesContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  caloriesNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  caloriesText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#90C3F9',
    borderRadius: 20,
  },
  weekContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 20,
    paddingRight: 10,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  graphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
