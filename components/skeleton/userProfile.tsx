import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const ProfileSkeleton = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={skeletonStyles.container}>
      {/* Avatar */}
      <Animated.View style={[skeletonStyles.avatar, { opacity }]} />
      {/* Name */}
      <Animated.View style={[skeletonStyles.nameLine, { opacity }]} />
      {/* Title */}
      <Animated.View style={[skeletonStyles.titleLine, { opacity }]} />
      {/* Tags row */}
      <View style={skeletonStyles.tagsRow}>
        {[80, 60, 90].map((w, i) => (
          <Animated.View
            key={i}
            style={[skeletonStyles.tag, { width: w, opacity }]}
          />
        ))}
      </View>
      {/* Divider */}
      <View style={skeletonStyles.divider} />
      {/* Info rows */}
      {[1, 2, 3].map((_, i) => (
        <View key={i} style={skeletonStyles.infoRow}>
          <Animated.View style={[skeletonStyles.infoIcon, { opacity }]} />
          <Animated.View style={[skeletonStyles.infoLine, { opacity }]} />
        </View>
      ))}
      {/* Divider */}
      <View style={skeletonStyles.divider} />
      {/* About block */}
      <Animated.View style={[skeletonStyles.aboutTitle, { opacity }]} />
      <Animated.View style={[skeletonStyles.aboutLine, { opacity }]} />
      <Animated.View style={[skeletonStyles.aboutLineShort, { opacity }]} />
    </View>
  );
};

export default ProfileSkeleton;
const skeletonStyles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 16, alignItems: "center" },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E0E0E0",
    marginBottom: 12,
  },
  nameLine: {
    width: 160,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    marginBottom: 8,
  },
  titleLine: {
    width: 110,
    height: 14,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    marginBottom: 14,
  },
  tagsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tag: { height: 28, borderRadius: 14, backgroundColor: "#E0E0E0" },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginBottom: 12,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  infoLine: {
    flex: 1,
    height: 14,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
  },
  aboutTitle: {
    width: 60,
    height: 16,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  aboutLine: {
    width: "100%",
    height: 13,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    marginBottom: 7,
  },
  aboutLineShort: {
    width: "65%",
    height: 13,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-start",
  },
});
