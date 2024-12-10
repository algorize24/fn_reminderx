import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useLayoutEffect, useState } from "react";

// constants
import { Color } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Font";

// components
import TextInputs from "../../../../components/Inputs/TextInputs";
import AuthText from "../../../../components/header/AuthText";

// context
import { useReminder } from "../../../../context/reminderContext";

export default function AddCompartmentEveryday({ navigation }) {
  // reminder context
  const { medicationName, compartment, setCompartment } = useReminder();

  // error state
  const [error, setError] = useState("");

  // handle compartment selection
  const handleCompartmentChange = (text) => {
    // Update the compartment state but don't navigate
    const number = parseInt(text, 10);

    // Allow valid numbers between 1 and 5 or empty input
    if ((number >= 1 && number <= 5) || text === "") {
      setCompartment(text); // Update state only if valid
    }
  };

  const handleSetReminder = () => {
    if (!compartment) {
      setError(
        "Compartment number is required. Please enter a number between 1 and 5."
      );
    }
    // Only navigate when the compartment value is valid
    const number = parseInt(compartment, 10);
    if (number >= 1 && number <= 5) {
      navigation.navigate("SetReminder");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.title}>{medicationName && medicationName}</Text>
      ),
      headerRight: () => (
        <Pressable onPress={handleSetReminder}>
          <Text style={styles.header_right}>Set</Text>
        </Pressable>
      ),
    });
  }, [navigation, medicationName, handleSetReminder]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        <AuthText style={styles.text}>
          Please type the compartment you would like to choose (1-5).
        </AuthText>

        <View style={styles.container}>
          <Text style={styles.error}>{error}</Text>

          <View style={styles.inputView}>
            <TextInputs
              style={styles.input}
              maxLength={2}
              keyboardType={"numeric"}
              value={compartment}
              onChangeText={handleCompartmentChange}
              placeholder={"e.g., 1"}
            />
            <Text style={styles.cid}>Compartment</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  title: {
    fontFamily: Fonts.main,
    textTransform: "capitalize",
    color: "#fff",
    fontSize: 14,
  },

  text: {
    textTransform: "none",
    marginHorizontal: 18,
    marginBottom: 20,
    marginTop: 50,
    fontSize: 20,
    width: 320,
  },

  container: {
    flex: 1,
    backgroundColor: Color.container,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  inputView: {
    margin: "auto",
    width: "50%",
    marginVertical: 30,
    alignItems: "center",
  },

  input: {
    backgroundColor: Color.bgColor,
    borderRadius: 8,
    color: "#fff",
    width: 120,
    textAlign: "center",
    marginVertical: 10,
    paddingVertical: 15,
  },

  cid: {
    textAlign: "center",
    fontFamily: Fonts.main,
    fontSize: 15,
    color: Color.tagLine,
  },

  header_right: {
    fontFamily: Fonts.main,
    color: "#fff",
  },

  error: {
    fontFamily: Fonts.main,
    color: Color.redColor,
    marginHorizontal: 18,
    marginTop: 40,
  },
});
