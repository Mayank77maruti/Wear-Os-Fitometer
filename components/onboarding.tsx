import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  ViewToken,
  TextInput,
  ScrollView,
  Keyboard,
  Modal,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  OnboardingScreen: undefined;
  Report: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingScreen'>;

interface FormData {
  name: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
  medicalConditions: string[];
  fitnessGoals: string[];
}

const initialFormData: FormData = {
  name: '',
  age: '',
  height: '',
  weight: '',
  activityLevel: '',
  medicalConditions: [],
  fitnessGoals: [],
};

const steps = [
  {
    id: '1',
    title: 'Welcome',
    description: 'Lets create your personalized health journey',
    type: 'welcome'
  },
  {
    id: '2',
    title: 'Basic Info',
    description: 'Tell us about yourself',
    type: 'basic'
  },
  {
    id: '3',
    title: 'Body Metrics',
    description: 'Help us understand your physique',
    type: 'metrics'
  },
  {
    id: '4',
    title: 'Activity Level',
    description: 'Your fitness routine matters',
    type: 'activity'
  },
  {
    id: '5',
    title: 'Health Profile',
    description: 'Important for your safety',
    type: 'health'
  }
];

interface OnboardingItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    type: string;
  };
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
  navigation: OnboardingScreenNavigationProp;
  showWarning: (message: string) => void;
}

const OnboardingItem = ({ item, formData, updateFormData, navigation, showWarning }: OnboardingItemProps) => {
  const renderContent = () => {
    switch (item.type) {
      case 'welcome':
        return (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome to Your Health Journey</Text>
            <Image
              source={require('../assets/food.png')}
              style={styles.welcomeImage}
            />
          </View>
        );
      case 'basic':
        return (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                placeholder="Enter your name"
                placeholderTextColor="#ffffff50"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => updateFormData('age', text)}
                placeholder="Enter your age"
                placeholderTextColor="#ffffff50"
                keyboardType="numeric"
              />
            </View>
            {(!formData.name || !formData.age) && (
              <Text style={styles.warningText}>
                These fields are required for the best results.
              </Text>
            )}
          </View>
        );

      case 'metrics':
        return (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.height}
                onChangeText={(text) => updateFormData('height', text)}
                placeholder="Enter your height"
                placeholderTextColor="#ffffff50"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(text) => updateFormData('weight', text)}
                placeholder="Enter your weight"
                placeholderTextColor="#ffffff50"
                keyboardType="numeric"
              />
            </View>
            {(!formData.height || !formData.weight) && (
              <Text style={styles.warningText}>
                These fields are required for the best results. 
              </Text>
            )}
          </View>
        );

      case 'activity':
        return (
          <View style={styles.formContainer}>
            {['Sedentary', 'Light Exercise', 'Moderate Exercise', 'Very Active'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.activityButton,
                  formData.activityLevel === level && styles.activityButtonActive
                ]}
                onPress={() => updateFormData('activityLevel', level)}
              >
                <Text style={[
                  styles.activityButtonText,
                  formData.activityLevel === level && styles.activityButtonTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'health':
        return (
          <ScrollView style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Medical Conditions</Text>
            <View style={styles.optionsGrid}>
              {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Obesity', 'Celiac Disease', 'Allergies', 'Kidney Disease'].map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.optionButton,
                    formData.medicalConditions.includes(condition) && styles.optionButtonActive
                  ]}
                  onPress={() => {
                    const conditions = formData.medicalConditions.includes(condition)
                      ? formData.medicalConditions.filter(c => c !== condition)
                      : [...formData.medicalConditions, condition];
                    updateFormData('medicalConditions', conditions);
                  }}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.medicalConditions.includes(condition) && styles.optionButtonTextActive
                  ]}>
                    {condition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Fitness Goals</Text>
            <View style={styles.optionsGrid}>
              {['Weight Loss', 'Muscle Gain', 'Better Health', 'More Energy'].map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.optionButton,
                    formData.fitnessGoals.includes(goal) && styles.optionButtonActive
                  ]}
                  onPress={() => {
                    const goals = formData.fitnessGoals.includes(goal)
                      ? formData.fitnessGoals.filter(g => g !== goal)
                      : [...formData.fitnessGoals, goal];
                    updateFormData('fitnessGoals', goals);
                  }}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.fitnessGoals.includes(goal) && styles.optionButtonTextActive
                  ]}>
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {renderContent()}
      </View>
    </View>
  );
};

interface CustomModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const slidesRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < steps.length - 1) {
      if (currentIndex === 1 && (!formData.name || !formData.age)) {
        showWarning('Please fill in your name and age for the best results. You can skip for now, but this information is important.');
      } else if (currentIndex === 2 && (!formData.height || !formData.weight)) {
        showWarning('Please fill in your height and weight for the best results. You can skip for now, but this information is important.');
      }
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Handle form submission and navigate to Home
      console.log('Form submitted:', formData);
      navigation.navigate('Home');
    }
  };

  const showWarning = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        data={steps}
        renderItem={({ item }) => (
          <OnboardingItem 
            item={item} 
            formData={formData}
            updateFormData={updateFormData}
            navigation={navigation}
            showWarning={showWarning}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.bottomContainer}>
        {!isKeyboardVisible && (
          <>
            <View style={styles.paginationDots}>
              {steps.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 20, 8],
                  extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    style={[styles.dot, { width: dotWidth, opacity }]}
                    key={index.toString()}
                  />
                );
              })}
            </View>
            <View style={styles.buttonContainer}>
              {currentIndex > 0 && (
                <TouchableOpacity
                  style={[styles.button, styles.previousButton]}
                  onPress={() => slidesRef.current?.scrollToIndex({ index: currentIndex - 1 })}
                >
                  <Text style={[styles.buttonText, styles.previousButtonText]}>PREVIOUS</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={scrollTo}
              >
                <Text style={styles.buttonText}>
                  {currentIndex === steps.length - 1 ? 'GET STARTED' : 'NEXT'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  itemContainer: {
    width,
    height,
    padding: 20,
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 1,
  },
  skipText: {
    color: '#ffffff80',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
    top:-120,
  },
  description: {
    fontWeight: '300',
    color: '#ffffff80',
    textAlign: 'center',
    paddingHorizontal: 2,
    top:-120,
  },
  formContainer: {
    top:0
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
    top:-100,
  },
  input: {
    backgroundColor: '#ffffff15',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    top:-100,
  },
  warningText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  activityButton: {
    backgroundColor: '#ffffff15',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityButtonActive: {
    backgroundColor: '#4285f4',
  },
  activityButtonText: {
    color: 'white',
    fontSize: 16,
  },
  activityButtonTextActive: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#ffffff15',
    padding: 12,
    borderRadius: 10,
    minWidth: '48%',
  },
  optionButtonActive: {
    backgroundColor: '#4285f4',
  },
  optionButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  optionButtonTextActive: {
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  previousButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  nextButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  previousButtonText: {
    color: 'white',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    top:-70,
  },
  welcomeImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    top:-20,
    
  },
});

