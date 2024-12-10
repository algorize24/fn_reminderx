import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

// components
import AuthText from "../../components/header/AuthText";
import MainButton from "../../components/buttons/MainButton";

// constants
import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

export default function ResetPassword({ navigation, route }) {
  // email from ForgotPassword.jsx
  const { email } = route.params;

  const handleResetPassword = () => {
    navigation.navigate("Signin");
  };
  return (
    <SafeAreaView style={styles.root}>
      <AuthText style={styles.auth_text}>reset password</AuthText>

      <View style={styles.textContainer}>
        <Text style={styles.text}>An email has been sent to:</Text>
        <Text style={styles.mail}>{email}</Text>
        <Text style={styles.text}>
          Please follow the instruction in the email to reset your password
          within 24 hours
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <MainButton style={styles.button} onPress={handleResetPassword}>
          Password is reset
        </MainButton>
        <Text style={styles.buttonText}>
          No mail from remindeRX? <Text style={styles.buttonLink}>Resend</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    marginTop: 30,
  },

  auth_text: {
    marginLeft: Platform.OS === "android" ? 0 : 10,
    marginTop: 20,
  },

  text: {
    color: Color.tagLine,
    fontFamily: Fonts.sub,
    textAlign: "center",
    paddingHorizontal: 10,
  },

  textContainer: {
    marginTop: 71,
    alignItems: "center",
  },

  buttonContainer: {
    marginTop: 87,
    alignItems: "center",
  },

  mail: {
    marginVertical: 26,
    fontFamily: Fonts.main,
    color: Color.purpleColor,
    textAlign: "center",
    fontSize: 16,
  },

  button: {
    width: "90%",
  },

  buttonText: {
    marginTop: 18,
    color: "white",
    fontFamily: Fonts.main,
    textAlign: "center",
  },

  buttonLink: {
    color: Color.purpleColor,
    textDecorationLine: "underline",
  },
});
