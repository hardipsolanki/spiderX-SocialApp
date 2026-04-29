import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { TEXTS } from "@/constants/texts";
import { authServices } from "@/firebase/auth";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PhoneForm = {
  phone: string;
};

export default function PhoneLogin() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PhoneForm>({
    defaultValues: { phone: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: PhoneForm) => {
    try {
      await authServices.signInWithPhoneNumber(`+91${data.phone}`);
      router.push({
        pathname: "/verifyOtp",
        params: { phone: data.phone },
      });
    } catch (error) {
      console.log("error on authWithPhone: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* TOP ILLUSTRATION */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/597/597177.png",
                }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{TEXTS.PHONE.TITLE}</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to receive a{"\n"}one-time verification
              code
            </Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            {/* Country + Phone Row */}
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneRow}>
              {/* Country Code Badge */}
              <View style={styles.countryBadge}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
              </View>

              {/* Phone Input */}
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: "Phone number is required",
                    minLength: {
                      value: 10,
                      message: "Enter valid 10 digit number",
                    },
                    maxLength: {
                      value: 10,
                      message: "Enter valid 10 digit number",
                    },
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter valid Indian mobile number",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      placeholder="9876543210"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      maxLength={10}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Helper Text */}
            <View style={styles.helperRow}>
              <Text style={styles.helperText}>
                OTP will be sent to this number
              </Text>
            </View>
          </View>

          {/* BUTTON */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={isSubmitting ? "Sending OTP..." : TEXTS.PHONE.BUTTON}
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
            />
          </View>

          {/* DIVIDER */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* SIGNUP LINK */}
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          {/* TERMS */}
          <Text style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> &{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  scroll: {
    padding: 24,
    flexGrow: 1,
  },

  /* Illustration */
  illustrationContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 28,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
  },

  /* Header */
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#444",
    marginBottom: 8,
  },

  /* Phone Row */
  phoneRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  countryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F3F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  flag: {
    fontSize: 16,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  /* Helper */
  helperRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#888",
  },

  /* Button */
  buttonContainer: {
    marginTop: 24,
  },

  /* Divider */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },

  /* Signup */
  signupBtn: {
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    color: "#6C5CE7",
    fontWeight: "600",
  },

  /* Terms */
  terms: {
    fontSize: 11,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },
  termsLink: {
    color: "#6C5CE7",
  },
});
