import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomInputProps } from "../types";

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error = null,
  editable = true,
  maxLength,
  returnKeyType = "done",
  onSubmitEditing,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input Wrapper */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          !editable && styles.disabled,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing || undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* 👁 Password Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.icon}
          >
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    width: "100%",
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280", // softer gray
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    height: 50,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },

  icon: {
    marginLeft: 8,
  },

  inputFocused: {
    borderColor: "#6C5CE7",
  },

  inputError: {
    borderColor: "#FF3B30",
  },

  disabled: {
    backgroundColor: "#F3F4F6",
  },

  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
});
