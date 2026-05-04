import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import {
    createUserThunk,
    getCurrentUserThunk,
} from "@/features/auth/authSlice";
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
    TextInput,
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
      about: "", // ✅ NEW FIELD
    },
  });

  // 📸 Image Picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
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
      Toast.show({ type: "error", text1: "Avatar required" });
      return;
    }

    if (!phoneNumber) {
      Toast.show({ type: "error", text1: "Phone missing" });
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
      .then(() => {
        dispatch(getCurrentUserThunk())
          .unwrap()
          .then(() => {
            Toast.show({
              type: "success",
              text1: "Profile created",
            });
            router.replace("/interests");
          });
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
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
            <Controller
              control={control}
              name="first_name"
              rules={{ required: "First name is required" }}
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

            <Controller
              control={control}
              name="last_name"
              rules={{ required: "Last name is required" }}
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

            {/* PHONE (disabled) */}
            <CustomInput
              label="Phone Number"
              value={phoneNumber || ""}
              editable={false}
              placeholder="+91"
              onChangeText={() => {}}
            />

            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
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

            <Controller
              control={control}
              name="designation"
              rules={{ required: "Designation is required" }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Designation"
                  value={value}
                  onChangeText={onChange}
                  error={errors.designation?.message}
                  placeholder="Developer"
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
                  value={value}
                  onChangeText={onChange}
                  error={errors.location?.message}
                  placeholder="India"
                />
              )}
            />

            {/* ✅ ABOUT (MULTILINE) */}
            <Controller
              control={control}
              name="about"
              rules={{
                required: "About is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.aboutContainer}>
                  <Text style={styles.label}>About</Text>
                  <TextInput
                    style={styles.aboutInput}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Tell us about yourself..."
                    multiline
                    numberOfLines={4}
                  />
                  {errors.about && (
                    <Text style={styles.error}>{errors.about.message}</Text>
                  )}
                </View>
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

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

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

  aboutContainer: {
    marginTop: 12,
  },

  label: {
    fontSize: 12,
    marginBottom: 4,
    color: "#444",
  },

  aboutInput: {
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    minHeight: 80,
  },

  error: {
    color: "red",
    fontSize: 11,
    marginTop: 4,
  },
});
