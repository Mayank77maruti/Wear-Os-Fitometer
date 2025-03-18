import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import Nav from '../components/nav';

type RootStackParamList = {
  Report: { imageUri: string };
};

type ReportScreenRouteProp = RouteProp<RootStackParamList, 'Report'>;

type Props = {
  route: ReportScreenRouteProp;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const sampleData = {
  "calories": 400,
  "fat": 20,
  "protein": 20,
  "sugar": 20,
  "iron": 0.5,
  "carbs": 10,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  resultContainer: {
    width: 300,
    height: 320,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  centerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E8F5E9',
    resizeMode: 'cover',
  },
  nutrientBubble: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#90C3F9',
  },
  bubbleText: {
    color: '#001F3F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bubbleValue: {
    color: '#001F3F',
    fontSize: 14,
  },
  fatBubble: {
    top: 50,
    left: 25,
  },
  caloriesBubble: {
    top: 13,
  },
  proteinBubble: {
    top: 170,
    left: 15,
  },
  ironBubble: {
    top: 50,
    right: 25,
  },
  carbsBubble: {
    top: 170,
    right: 15,
  },
  sugarBubble: {
    top: 245,
    backgroundColor: "#FF6B6B",
    paddingLeft: 3,
  },
  scanFrame: {
    width: 300,
    height: 320,
    position: 'absolute',
    top: 135,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderRadius: 20,
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderTopRightRadius: 20,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderBottomRightRadius: 20,
  },
  reportContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  reportSection: {
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reportText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  highlightText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

const bubbleData = [
  { style: styles.caloriesBubble, text: "Calories", value: sampleData.calories },
  { style: styles.ironBubble, text: "Iron", value: sampleData.iron + "g" },
  { style: styles.carbsBubble, text: "Carbs", value: sampleData.carbs + "g" },
  { style: styles.sugarBubble, text: "Added Sugar", value: sampleData.sugar + "g" },
  { style: styles.proteinBubble, text: "Protein", value: sampleData.protein + "g" },
  { style: styles.fatBubble, text: "FAT", value: sampleData.fat + "g" },
];

export default function ReportScreen({ route }: Props) {
  const { imageUri } = route.params;
  const [image, setImage] = useState<string | null>(null);
  const fadeAnims = useRef(bubbleData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (imageUri) {
      setImage(imageUri);
      const animations = fadeAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: index * 200,
          useNativeDriver: true,
        })
      );
      Animated.stagger(200, animations).start();
    }
  }, [imageUri]);

  return (
    <LinearGradient
      colors={['#001F3F', '#005F7F', '#0096D6']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Scan Results</Text>
          </View>

          <View style={styles.resultContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.centerImage}
              />
            ) : (
              <View style={styles.centerImage} />
            )}

            {bubbleData.map((bubble, index) => (
              <Animated.View
                key={bubble.text}
                style={[
                  styles.nutrientBubble,
                  bubble.style,
                  { opacity: fadeAnims[index] }
                ]}
              >
                <Text style={styles.bubbleText}>{bubble.text}</Text>
                <Text style={styles.bubbleValue}>{bubble.value}</Text>
              </Animated.View>
            ))}
          </View>

          <Text style={styles.subtitle}>Personalised Report</Text>
          <View style={styles.reportContainer}>
            <View style={styles.reportSection}>
              <Text style={styles.reportTitle}>Nutritional Overview</Text>
              <Text style={styles.reportText}>
                Based on your scan, your meal contains a <Text style={styles.highlightText}>balanced mix of nutrients</Text>.
                The protein content is adequate, but you might want to consider increasing your intake of complex carbohydrates
                for sustained energy throughout the day.
              </Text>
            </View>
            <View style={styles.reportSection}>
              <Text style={styles.reportTitle}>Recommendations</Text>
              <Text style={styles.reportText}>
                1. Increase fiber intake by adding more vegetables or whole grains.{'\n'}
                2. Consider reducing added sugars for better overall health.{'\n'}
                3. Maintain current protein levels to support muscle health.
              </Text>
            </View>
            <View style={styles.reportSection}>
              <Text style={styles.reportTitle}>Health Insights</Text>
              <Text style={styles.reportText}>
                Your iron intake is on the lower side. Consider incorporating more iron-rich foods like leafy greens or lean meats
                in your future meals to support optimal blood health and energy levels.
              </Text>
            </View>
          </View>

          <View style={styles.scanFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
        </View>
      </ScrollView>
      <Nav />
    </LinearGradient>
  );
}

