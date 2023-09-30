import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { LoginScreenNavigationProp } from "../navigation/NavigationTypes";
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard } from "react-native";
import { SERVER_URL } from "../../config";

type LoginData = { email: string; password: string };

export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginScreen: React.FC<{ navigation: LoginScreenNavigationProp }> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState<string>();

  useEffect(() => {
    // Check if the accessToken is stored
    const checkAccessToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");

        if (accessToken) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Tasks" }],
          });
        } else {
          return;
        }
      } catch (error) {
        console.error("Error checking accessToken:", error);
      }
    };

    checkAccessToken();
  }, []);

  const handleLogin = async (values: any): Promise<void> => {
    Keyboard.dismiss();
    try {
      setIsLoading(true);
      const apiUrl: string = `${SERVER_URL}/auth/login`;

      const response = await axios.post(
        apiUrl,
        { email: values.email, password: values.password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Logged in successful:", response.data);

      if (response.status == 200) {
        setErrorResponse(undefined);

        // saving the access token
        const accessToken = response.data.token;
        await AsyncStorage.setItem("accessToken", accessToken);

        navigation.navigate("Tasks");
      }
    } catch (error) {
      const errMessage: string =
        (error as any).response.data.error ??
        Object.values((error as any).response.data.errors);
      setErrorResponse(`${errMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(
          values: LoginData,
          { setSubmitting }: FormikHelpers<LoginData>
        ): void => {
          handleLogin(values)
            .then(() => {
              setSubmitting(false);
            })
            .catch((error): void => {
              console.error(error);
              setSubmitting(false);
            });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isSubmitting,
        }: FormikProps<LoginData>) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            <Text style={{ color: "red" }}>{errors.email}</Text>

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            <Text style={styles.errorText}>{errors.password}</Text>

            <Button
              title="Login"
              onPress={(): void => handleSubmit()}
              disabled={!values.email || !values.password || isSubmitting}
            />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <Button
              title="Register"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        )}
      </Formik>
      <Text style={styles.errorRes}>{errorResponse}</Text>
      {isLoading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "blue",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "gray",
  },
  orText: {
    marginHorizontal: 10,
    color: "gray",
  },
  errorRes: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
