// components/CustomButton.tsx
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { CustomButtonProps } from "../types";

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "secondary",
  disabled = false,
  loading = false,
  style = {},
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton;
      case "outline":
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#007AFF" : "#fff"} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#5856D6",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#007AFF",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  outlineText: {
    color: "#007AFF",
  },
});

export default CustomButton;
