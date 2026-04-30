import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUserThunk, getCurrentUserThunk } from "@/features/authSlice";
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
  const dispatch = useAppDispatch();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // ✅ Get phone from redux (after OTP verify)
  const phoneNumber = useAppSelector((state) => state.auth.user?.phone_number);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUser>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      designation: "",
      location: "",
    },
  });

  // 📸 Image Picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Gallery access is required",
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
        text1: "Avatar required",
      });
      return;
    }

    if (!phoneNumber) {
      Toast.show({
        type: "error",
        text1: "Phone missing",
      });
      return;
    }

    dispatch(
      createUserThunk({
        ...data,
        phone_number: phoneNumber,
        avatar: avatarUri,
      }),
    )
      .unwrap()
      .then((data) => {
        if (data) {
          dispatch(getCurrentUserThunk())
            .unwrap()
            .then((data) => {
              if (data) {
                Toast.show({
                  type: "success",
                  text1: "Profile created",
                });
                router.replace("/interests");
              }
            });
        }
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: err.message || "Error",
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* HEADER */}
          <Text style={styles.title}>Create Profile</Text>

          {/* AVATAR */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={30} color="#6C5CE7" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* FORM */}
          <View style={styles.card}>
            {/* First Name */}
            <Controller
              control={control}
              name="first_name"
              rules={{ required: "Required" }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="First Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.first_name?.message}
                  placeholder="John"
                />
              )}
            />

            {/* Last Name */}
            <Controller
              control={control}
              name="last_name"
              rules={{ required: "Required" }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Last Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.last_name?.message}
                  placeholder="Doe"
                />
              )}
            />

            {/* ✅ PHONE (DISABLED) */}
            <CustomInput
              label="Phone Number"
              value={phoneNumber || ""}
              editable={false}
              placeholder="+91"
              onChangeText={() => {}}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{ required: "Required" }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  placeholder="john@example.com"
                />
              )}
            />

            {/* Designation */}
            <Controller
              control={control}
              name="designation"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Designation"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Developer"
                />
              )}
            />

            {/* Location */}
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Location"
                  value={value}
                  onChangeText={onChange}
                  placeholder="India"
                />
              )}
            />
          </View>

          {/* BUTTON */}
          <CustomButton
            title="Create Profile"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading === "pending"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  scroll: { padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEE9FF",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
});
