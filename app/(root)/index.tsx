import { getCurrentUserThunk } from "@/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUserThunk());

    const interval = setInterval(() => {
      if (!user) {
        router.replace("/(auth)/phoneLogin");
      } else if (user && !user?.avatar) {
        router.replace("/(auth)/createProfile");
      } else if (user.avatar && !user.interests?.length) {
        router.replace("/(root)/interests");
      } else {
        router.replace("/(tabs)/home");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  // Animation values
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const particle2 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const particle3 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orb1Scale = useRef(new Animated.Value(0.8)).current;
  const orb2Scale = useRef(new Animated.Value(0.9)).current;

  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const iconGlow = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleY = useRef(new Animated.Value(20)).current;

  const dotsOpacity = useRef(new Animated.Value(0)).current;

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const featureRow1 = useRef(new Animated.Value(0)).current;
  const featureRow2 = useRef(new Animated.Value(0)).current;
  const featureRow3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Background fade in
    Animated.timing(bgOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // 2. Floating orbs pulse loop
    const pulsOrb1 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Scale, {
          toValue: 1.15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(orb1Scale, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    );
    const pulsOrb2 = Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Scale, {
          toValue: 0.7,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(orb2Scale, {
          toValue: 1.1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulsOrb1.start();
    pulsOrb2.start();

    // 3. Floating particles
    const floatParticle = (
      val: Animated.ValueXY,
      toX: number,
      toY: number,
      duration: number,
      delay: number,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: { x: toX, y: toY },
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: { x: 0, y: 0 },
            duration,
            useNativeDriver: true,
          }),
        ]),
      );

    floatParticle(particle1, -12, -20, 2800, 0).start();
    floatParticle(particle2, 10, -15, 3200, 600).start();
    floatParticle(particle3, -8, 18, 2500, 1200).start();

    // 4. Icon entrance — bounce in
    setTimeout(() => {
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();

      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();

      // Icon glow pulse loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconGlow, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(iconGlow, {
            toValue: 0.3,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, 400);

    // 5. Title slides up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(titleY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 750);

    // 6. Subtitle
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1050);

    // 7. Feature rows staggered
    setTimeout(() => {
      Animated.timing(featureRow1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1300);
    setTimeout(() => {
      Animated.timing(featureRow2, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1500);
    setTimeout(() => {
      Animated.timing(featureRow3, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1700);

    // 8. Dots
    setTimeout(() => {
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 1900);

    // 9. Button rises
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(buttonY, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2100);
  }, []);

  const iconRotateInterp = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-20deg", "0deg"],
  });

  const iconGlowOpacity = iconGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
  });

  const features = [
    { icon: "chatbubbles-outline", label: "Instant Messaging" },
    { icon: "search-outline", label: "Find Your People" },
    { icon: "shield-checkmark-outline", label: "Safe & Private" },
  ];
  const featureAnims = [featureRow1, featureRow2, featureRow3];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Deep background gradient */}
      <LinearGradient
        colors={["#0D0B1F", "#1A1040", "#0D0B1F"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating orb 1 — top left */}
      <Animated.View
        style={[styles.orb, styles.orb1, { transform: [{ scale: orb1Scale }] }]}
      >
        <LinearGradient
          colors={["#6C5CE7AA", "#4B3DF044"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Floating orb 2 — bottom right */}
      <Animated.View
        style={[styles.orb, styles.orb2, { transform: [{ scale: orb2Scale }] }]}
      >
        <LinearGradient
          colors={["#A29BFE66", "#6C5CE733"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Floating particles */}
      {[particle1, particle2, particle3].map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              top: [height * 0.2, height * 0.5, height * 0.7][i],
              left: [width * 0.15, width * 0.75, width * 0.4][i],
              width: [6, 4, 5][i],
              height: [6, 4, 5][i],
              opacity: [0.5, 0.35, 0.4][i],
              transform: [{ translateX: p.x }, { translateY: p.y }],
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* ——— ICON ——— */}
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ scale: iconScale }, { rotate: iconRotateInterp }],
              },
            ]}
          >
            {/* Glow ring */}
            <Animated.View
              style={[styles.iconGlow, { opacity: iconGlowOpacity }]}
            />
            <LinearGradient
              colors={["#8B7CF6", "#6C5CE7", "#4B3DF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Ionicons name="people" size={34} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* ——— TITLE ——— */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleY }],
              },
            ]}
          >
            Connect.{"\n"}Chat. Grow.
          </Animated.Text>

          {/* ——— SUBTITLE ——— */}
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleY }],
              },
            ]}
          >
            Find people with similar interests and start meaningful
            conversations.
          </Animated.Text>

          {/* ——— FEATURE ROWS ——— */}
          <View style={styles.featuresContainer}>
            {features.map((f, i) => (
              <Animated.View
                key={f.label}
                style={[
                  styles.featureRow,
                  {
                    opacity: featureAnims[i],
                    transform: [
                      {
                        translateX: featureAnims[i].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-24, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.featureIconBg}>
                  <Ionicons name={f.icon as any} size={16} color="#A29BFE" />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </Animated.View>
            ))}
          </View>

          {/* ——— DOTS ——— */}
          <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
            {[1, 0, 0].map((active, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  active ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </Animated.View>

          {/* ——— BUTTON ——— */}
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                opacity: buttonOpacity,
                transform: [{ translateY: buttonY }, { scale: buttonScale }],
              },
            ]}
          >
            <Text style={styles.termsText}>
              By continuing you agree to our{" "}
              <Text style={styles.termsLink}>Terms & Privacy</Text>
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0D0B1F",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  // Orbs
  orb: {
    position: "absolute",
    borderRadius: 999,
    overflow: "hidden",
  },
  orb1: {
    width: width * 0.75,
    height: width * 0.75,
    top: -width * 0.2,
    left: -width * 0.25,
    opacity: 0.6,
  },
  orb2: {
    width: width * 0.65,
    height: width * 0.65,
    bottom: -width * 0.2,
    right: -width * 0.2,
    opacity: 0.5,
  },

  // Particles
  particle: {
    position: "absolute",
    borderRadius: 99,
    backgroundColor: "#A29BFE",
  },

  // Icon
  iconWrapper: {
    marginBottom: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#6C5CE7",
  },
  iconGradient: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  // Text
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 46,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#9E9BBF",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 36,
    paddingHorizontal: 8,
  },

  // Features
  featuresContainer: {
    width: "100%",
    marginBottom: 36,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF12",
    borderWidth: 1,
    borderColor: "#FFFFFF18",
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: 15,
    color: "#C5C3DC",
    fontWeight: "500",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 40,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: "#6C5CE7",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#FFFFFF30",
  },

  // Button
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: width - 64,
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  termsText: {
    marginTop: 16,
    fontSize: 12,
    color: "#6B6882",
    textAlign: "center",
  },
  termsLink: {
    color: "#8B7CF6",
  },
});
