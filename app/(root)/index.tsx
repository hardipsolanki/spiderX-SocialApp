import { getCurrentUserThunk } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

// ─── Animated Ring component ───────────────────────────────────────────────
function PulseRing({
  delay,
  size,
  color,
}: {
  delay: number;
  size: number;
  color: string;
}) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    anim.start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

// ─── Floating Particle ─────────────────────────────────────────────────────
function FloatParticle({
  x,
  y,
  size,
  color,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -14,
          duration: 2600 + delay * 0.3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2600 + delay * 0.3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Entrance animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(28)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleY = useRef(new Animated.Value(20)).current;
  const pill1Opacity = useRef(new Animated.Value(0)).current;
  const pill1X = useRef(new Animated.Value(-20)).current;
  const pill2Opacity = useRef(new Animated.Value(0)).current;
  const pill2X = useRef(new Animated.Value(-20)).current;
  const pill3Opacity = useRef(new Animated.Value(0)).current;
  const pill3X = useRef(new Animated.Value(-20)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;
  const barY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    dispatch(getCurrentUserThunk());

    // Progress bar animation (5s)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      if (!user) {
        router.replace("/(auth)/phoneLogin");
      } else if (user && !user?.avatar) {
        router.replace("/(auth)/createProfile");
      } else if (user.avatar && !user.interest?.length) {
        router.replace("/(root)/interests");
      } else {
        router.replace("/(tabs)/home");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Staggered entrance sequence
    const seq = [
      // Logo bounce
      () =>
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 5,
            tension: 55,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(),

      // Title slides up
      () =>
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(titleY, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(),

      // Subtitle
      () =>
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(subtitleY, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(),

      // Pills staggered
      () =>
        Animated.parallel([
          Animated.timing(pill1Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(pill1X, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(),
      () =>
        Animated.parallel([
          Animated.timing(pill2Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(pill2X, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(),
      () =>
        Animated.parallel([
          Animated.timing(pill3Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(pill3X, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(),

      // Progress bar
      () =>
        Animated.parallel([
          Animated.timing(barOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(barY, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(),
    ];

    const delays = [200, 700, 1050, 1350, 1550, 1750, 2000];
    delays.forEach((d, i) => setTimeout(seq[i], d));
  }, []);

  const pillAnims = [
    { opacity: pill1Opacity, x: pill1X },
    { opacity: pill2Opacity, x: pill2X },
    { opacity: pill3Opacity, x: pill3X },
  ];

  const features: { icon: any; label: string; sub: string }[] = [
    {
      icon: "people-outline",
      label: "Find Your People",
      sub: "Match by interests",
    },
    {
      icon: "chatbubbles-outline",
      label: "Instant Messaging",
      sub: "Real-time conversations",
    },
    {
      icon: "shield-checkmark-outline",
      label: "Safe & Private",
      sub: "Your data, protected",
    },
  ];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Background */}
      <LinearGradient
        colors={["#FFFFFF", "#F8F7FF", "#EEF2FF"]}
        // colors={["#0A0818", "#130F2A", "#0A0818"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Background glow blobs */}
      <View style={[s.blob, s.blobTop]} />
      <View style={[s.blob, s.blobBottom]} />

      {/* Grid lines overlay */}
      <View style={s.gridOverlay} pointerEvents="none">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[s.gridLine, { top: (height / 6) * i }]} />
        ))}
      </View>

      {/* Floating particles */}
      <FloatParticle
        x={width * 0.08}
        y={height * 0.18}
        size={5}
        color="#8B7CF6"
        delay={400}
      />
      <FloatParticle
        x={width * 0.82}
        y={height * 0.25}
        size={4}
        color="#A29BFE"
        delay={900}
      />
      <FloatParticle
        x={width * 0.65}
        y={height * 0.6}
        size={6}
        color="#6C5CE7"
        delay={200}
      />
      <FloatParticle
        x={width * 0.15}
        y={height * 0.7}
        size={3}
        color="#DFE6E9"
        delay={1100}
      />
      <FloatParticle
        x={width * 0.88}
        y={height * 0.72}
        size={5}
        color="#A29BFE"
        delay={600}
      />

      <SafeAreaView style={s.safe}>
        <View style={s.container}>
          {/* ── Logo ── */}
          <Animated.View
            style={[
              s.logoWrap,
              { opacity: logoOpacity, transform: [{ scale: logoScale }] },
            ]}
          >
            {/* Pulse rings */}
            <PulseRing delay={0} size={130} color="#6C5CE755" />
            <PulseRing delay={700} size={130} color="#8B7CF633" />

            {/* Inner glow */}
            <View style={s.logoGlow} />

            <LinearGradient
              colors={["#9F8FFF", "#6C5CE7", "#4B3DF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.logoGrad}
            >
              <Ionicons name="people" size={36} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* ── Title ── */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleY }],
              alignItems: "center",
            }}
          >
            <Text style={s.tag}>WELCOME TO</Text>
            <Text style={s.title}>Nexus</Text>
          </Animated.View>

          {/* ── Subtitle ── */}
          <Animated.Text
            style={[
              s.subtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleY }],
              },
            ]}
          >
            Connect with people who share your passions and build meaningful
            relationships.
          </Animated.Text>

          {/* ── Feature Pills ── */}
          <View style={s.pillsContainer}>
            {features.map((f, i) => (
              <Animated.View
                key={f.label}
                style={[
                  s.pill,
                  {
                    opacity: pillAnims[i].opacity,
                    transform: [{ translateX: pillAnims[i].x }],
                  },
                ]}
              >
                <View style={s.pillIcon}>
                  <Ionicons name={f.icon} size={18} color="#A29BFE" />
                </View>
                <View style={s.pillText}>
                  <Text style={s.pillLabel}>{f.label}</Text>
                  <Text style={s.pillSub}>{f.sub}</Text>
                </View>
                <View style={s.pillDot} />
              </Animated.View>
            ))}
          </View>

          {/* ── Progress Bar ── */}
          <Animated.View
            style={[
              s.progressWrap,
              { opacity: barOpacity, transform: [{ translateY: barY }] },
            ]}
          >
            <Text style={s.progressLabel}>Setting things up…</Text>
            <View style={s.progressTrack}>
              <Animated.View style={[s.progressFill, { width: progressWidth }]}>
                <LinearGradient
                  colors={["#8B7CF6", "#6C5CE7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                {/* Shimmer effect */}
                <View style={s.progressShimmer} />
              </Animated.View>
            </View>
            <Text style={s.termsText}>
              By continuing you agree to our{" "}
              <Text style={s.termsLink}>Terms & Privacy</Text>
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const PURPLE = "#6C5CE7";
const PURPLE_LIGHT = "#A29BFE";
const PURPLE_DIM = "#8B7CF622";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0818" },
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 0,
  },

  // Background
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobTop: {
    width: width * 0.9,
    height: width * 0.9,
    top: -width * 0.35,
    left: -width * 0.2,
    backgroundColor: "#5A4BC510",
  },
  blobBottom: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.3,
    right: -width * 0.25,
    backgroundColor: "#4B3DF00D",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: "#FFFFFF05",
  },

  // Logo
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
    width: 130,
    height: 130,
  },
  logoGlow: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PURPLE,
    opacity: 0.18,
  },
  logoGrad: {
    width: 80,
    height: 80,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },

  // Title
  tag: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    color: PURPLE_LIGHT,
    marginBottom: 8,
    opacity: 0.7,
  },
  title: {
    fontSize: 52,
    fontWeight: "800",
    color: "#6C5CE7",
    letterSpacing: -1.5,
    marginBottom: 14,
    textShadowColor: PURPLE + "66",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  subtitle: {
    fontSize: 15,
    color: "#9896B8",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 36,
    paddingHorizontal: 6,
  },

  // Feature pills
  pillsContainer: {
    width: "100%",
    gap: 10,
    marginBottom: 44,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF07",
    borderWidth: 0.5,
    borderColor: "#FFFFFF14",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  pillIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: PURPLE_DIM,
    borderWidth: 0.5,
    borderColor: PURPLE_LIGHT + "33",
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { flex: 1 },
  pillLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: PURPLE_LIGHT,
    marginBottom: 2,
  },
  pillSub: {
    fontSize: 12,
    color: "#6B6882",
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PURPLE + "88",
  },

  // Progress
  progressWrap: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  progressLabel: {
    fontSize: 12,
    color: "#6B6882",
    letterSpacing: 0.3,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF10",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressShimmer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 40,
    backgroundColor: "#FFFFFF30",
    borderRadius: 2,
  },
  termsText: {
    marginTop: 6,
    fontSize: 11,
    color: "#4A4862",
    textAlign: "center",
  },
  termsLink: {
    color: PURPLE_LIGHT,
    opacity: 0.8,
  },
});
