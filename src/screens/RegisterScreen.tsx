import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { RegisterScreenNavigationProp } from "../navigation/NavigationTypes";
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import { Keyboard } from "react-native";
import { SERVER_URL } from "../../config";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null as any], "Passwords must match")
    .required("Confirm password is required"),
});

const RegisterScreen: React.FC<{
  navigation: RegisterScreenNavigationProp;
}> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState<string>();

  const handleRegister = async (values: any): Promise<void> => {
    Keyboard.dismiss();
    try {
      setIsLoading(true);

      const apiUrl: string = `${SERVER_URL}/auth/register`;

      const response = await axios.post(
        apiUrl,
        { name: values.name, email: values.email, password: values.password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Registration successful:", response.data);
      console.log(response.status);

      if (response.status == 201) {
        setErrorResponse(undefined);
        navigation.navigate("Login");
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
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(
          values: RegisterData,
          { setSubmitting }: FormikHelpers<RegisterData>
        ): void => {
          handleRegister(values)
            .then((): void => {
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
        }: FormikProps<RegisterData>) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            <Text style={{ color: "red" }}>{errors.name}</Text>

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
            <Text style={{ color: "red" }}>{errors.password}</Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
            />
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>

            <Button
              title="Register"
              onPress={(): void => handleSubmit()}
              disabled={
                !values.name ||
                !values.email ||
                !values.password ||
                !values.confirmPassword ||
                isSubmitting
              }
            />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <Button
              title="Login"
              onPress={() => navigation.navigate("Login")}
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

export default RegisterScreen;
