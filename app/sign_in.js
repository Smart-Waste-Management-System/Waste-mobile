import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../constants";
import { Stack, useRouter } from "expo-router";

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const passwordRef = useRef(null);

  const handleSignIn = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Lỗi", "Số điện thoại và mật khẩu là bắt buộc.");
      return;
    }

    const payload = {
      phone: phoneNumber,
      password: password,
    };

    try {
      const response = await fetch("http://14.225.255.120/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Đăng nhập thành công.", [
          {
            text: "OK",
            onPress: () => router.push(`/home/${data.data.ID}`),
          },
        ]);
      } else {
        Alert.alert("Lỗi", data.message || "Thông tin đăng nhập không chính xác.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng thử lại sau." + error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: SIZES.medium,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/bin.png")}
            style={{ width: 120, height: 120, marginBottom: SIZES.large }}
          />
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              marginBottom: SIZES.xxLarge,
              textAlign: "center",
              color: COLORS.primary,
            }}
          >
            ĐĂNG NHẬP
          </Text>

          {/* Phone Number */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: SIZES.small,
              padding: SIZES.small,
              marginBottom: SIZES.medium,
              width: "100%",
              backgroundColor: COLORS.lightGray,
            }}
            placeholder="Số điện thoại"
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          {/* Password */}
          <TextInput
            ref={passwordRef}
            style={{
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: SIZES.small,
              padding: SIZES.small,
              marginBottom: SIZES.medium,
              width: "100%",
              backgroundColor: COLORS.lightGray,
            }}
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />

          {/* Login Button */}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: SIZES.small,
              paddingHorizontal: SIZES.large,
              borderRadius: SIZES.small,
              alignItems: "center",
              width: "100%",
              marginBottom: SIZES.medium,
            }}
            onPress={handleSignIn}
          >
            <Text style={{ color: COLORS.lightWhite, fontSize: 16 }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.secondary,
              paddingVertical: SIZES.small,
              paddingHorizontal: SIZES.large,
              borderRadius: SIZES.small,
              alignItems: "center",
              width: "100%", // Căn giữa nút đăng ký
              marginBottom: SIZES.medium,
            }}
            onPress={() => router.push(`/sign_up`)}
          >
            <Text style={{ color: COLORS.lightWhite, fontSize: 16 }}>
              Đăng ký
            </Text>
          </TouchableOpacity>          

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={() => Alert.alert("Đặt lại mật khẩu")}>
            <Text style={{ color: COLORS.primary, fontSize: 14 }}>
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
