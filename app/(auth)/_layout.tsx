import { Slot } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    // <View style={{ flex: 1 }}>
    //   <Text>Header</Text>
    <Slot />
    //   <Text>Footer</Text>
    // </View>
  );
};

export default _layout;
