import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { COLORS, SIZES } from "../constants";
import { Stack, useRouter } from "expo-router";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const lastNameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const router = useRouter();
  

  const handleSignUp = async () => {
    if (!firstName || !lastName || !password || !confirmPassword) {
      console.log('manh', firstName + lastName + password + confirmPassword);
      Alert.alert("Lỗi", "Tất cả các trường đều là bắt buộc.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp.");
      return;
    }

    const payload = {
      first_name: firstName || "",
      last_name: lastName || "",
      email: email,
      phone: phoneNumber,
      password: password,
      category: "fulltime",
      gender: "male",
      role: "staff",
    };

    try {
      const response = await fetch("http://14.225.255.120/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Tạo tài khoản thành công.");
      } else {
        Alert.alert("Lỗi", data.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể tạo tài khoản. Vui lòng thử lại sau." + error
      );
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
          justifyContent: "center", // Căn giữa theo chiều dọc
          alignItems: "center", // Căn giữa theo chiều ngang
          padding: SIZES.medium,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", width: "100%" }}>
          {/* Logo */}
          <Image
            source={require("../assets/bin.png")} // Thêm logo của bạn vào đây
            style={{
              width: 120,
              height: 120,
              marginBottom: SIZES.large,
            }}
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
            Đăng ký
          </Text>

          {/* Full Name */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: SIZES.small,
              padding: SIZES.small,
              marginBottom: SIZES.medium,
              width: "100%", // Đặt chiều rộng của trường nhập liệu
              backgroundColor: COLORS.lightGray,
            }}
            placeholder="Họ và tên đệm"
            value={firstName}
            onChangeText={setFirstName}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />

          {/* LastName */}
          <TextInput
            ref={lastNameRef}
            style={{
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: SIZES.small,
              padding: SIZES.small,
              marginBottom: SIZES.medium,
              width: "100%",
              backgroundColor: COLORS.lightGray,
            }}
            placeholder="Tên"
            value={lastName}
            onChangeText={setLastName}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

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
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          {/* Email */}
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
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
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />

          {/* Confirm Password */}
          <TextInput
            ref={confirmPasswordRef}
            style={{
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: SIZES.small,
              padding: SIZES.small,
              marginBottom: SIZES.medium,
              width: "100%",
              backgroundColor: COLORS.lightGray,
            }}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: SIZES.small,
              paddingHorizontal: SIZES.large,
              borderRadius: SIZES.small,
              alignItems: "center",
              width: "100%", // Căn giữa nút đăng ký
              marginBottom: SIZES.medium,
            }}
            onPress={handleSignUp}
          >
            <Text style={{ color: COLORS.lightWhite, fontSize: 16 }}>
              Đăng ký
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
            onPress={() => router.push(`/sign_in`)}
          >
            <Text style={{ color: COLORS.lightWhite, fontSize: 16 }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
