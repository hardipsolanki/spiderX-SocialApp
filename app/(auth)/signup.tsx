import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { TEXTS } from "@/constants/texts";
import { createUserThunk } from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CreateUser } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import Toast from "react-native-toast-message";

export default function SignUp() {
  const router = useRouter();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUser>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      designation: "",
      location: "",
      avatar: "",
    },
    mode: "onChange",
  });

  //  Image Picker
  const pickImage = async () => {
    // Permission mango
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Gallery access is required to pick a photo",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setAvatarUri(base64Image);
    }
  };

  const onSubmit = async (data: CreateUser) => {
    if (!avatarUri) {
      Toast.show({
        type: "error",
        text1: "Avatar is required",
        text2: "Please select an avatar",
      });
      return;
    }
    dispatch(createUserThunk(data))
      .unwrap()
      .then((result) => {
        if (result) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "User created successfully",
          });
          router.replace("/(auth)/phoneLogin");
        }
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Something went wrong",
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{TEXTS.SIGNUP.TITLE}</Text>
            <Text style={styles.subtitle}>{TEXTS.SIGNUP.SUBTITLE}</Text>
          </View>

          {/* ✅ AVATAR PICKER */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person-add" size={32} color="#6C5CE7" />
                </View>
              )}

              {/* Camera Icon Badge */}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.avatarLabel}>
              {avatarUri ? "Tap to change photo" : "Add profile photo"}
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.card}>
            {/* First + Last Name */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="first_name"
                  rules={{ required: "First name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      label="First Name"
                      placeholder="John"
                      value={value}
                      onChangeText={onChange}
                      error={errors.first_name?.message}
                    />
                  )}
                />
              </View>

              <View style={{ width: 12 }} />

              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="last_name"
                  rules={{ required: "Last name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      label="Last Name"
                      placeholder="Doe"
                      value={value}
                      onChangeText={onChange}
                      error={errors.last_name?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Phone */}
            <Controller
              control={control}
              name="phone_number"
              rules={{
                required: "Phone is required",
                minLength: { value: 10, message: "Enter valid phone number" },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Phone"
                  placeholder="+91 9876543210"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  error={errors.phone_number?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Email"
                  placeholder="john@example.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />

            {/* <View style={styles.divider} /> */}

            {/* Optional Fields */}
            <Controller
              control={control}
              name="designation"
              rules={{ required: "Designation is required" }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Designation"
                  placeholder="Developer"
                  value={value}
                  onChangeText={onChange}
                  error={errors.designation?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              rules={{ required: "Location is required" }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Location"
                  placeholder="India"
                  value={value}
                  onChangeText={onChange}
                  error={errors.location?.message}
                />
              )}
            />
          </View>

          {/* BUTTON */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={TEXTS.SIGNUP.BUTTON}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading === "pending"}
              disabled={isLoading === "pending"}
            />
          </View>

          {/* LOGIN */}
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.push("/phoneLogin")}
            >
              Login
            </Text>
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
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },

  /* Avatar */
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#6C5CE7",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#6C5CE7",
    borderStyle: "dashed",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6C5CE7",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F8F9FB",
  },
  avatarLabel: {
    fontSize: 12,
    color: "#6C5CE7",
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  loginLink: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
});
