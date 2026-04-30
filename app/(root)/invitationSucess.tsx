import CompletedEffect from "@/components/CompletedEffect";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const invitationSucess = () => {
  const { fullName } = useLocalSearchParams<{ fullName: string }>();
  return (
    <CompletedEffect
      btnText="Back to Home"
      checkmarkCircleGradientColor={["#00D26A", "#00B894", "#009F7A"]}
      subTitle={`Your invitation has been sent to ${fullName}`}
      title="Invitation Sent"
    />
  );
};

export default invitationSucess;

const styles = StyleSheet.create({});
