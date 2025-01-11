import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import axios from "axios";
import { COLORS } from "../../constants";

const EditProfileScreen = () => {
  const { id } = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    role: "",
    category: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://203.145.47.225:8080/users/${id}/info`);
      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          first_name: userData.FirstName || "",
          last_name: userData.LastName || "",
          gender: userData.Gender || "",
          role: userData.Role || "",
          category: userData.Category || "",
          email: userData.Email || "",
          phone: userData.Phone || "",
          password: userData.Password || "",
        });
      } else {
        Alert.alert("Lỗi" + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lấy dữ liệu người dùng.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://203.145.47.225:8080/users/${id}/edit`, {
        method: "PUT", // Hoặc "PATCH" tùy vào API của bạn
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Chuyển dữ liệu formData thành JSON
      });
  
      const data = await response.json(); // Lấy dữ liệu trả về từ API
  
      if (response.ok) {
        // Nếu thành công, thông báo thành công
        Alert.alert("Thành công!", "Đã lưu thông tin chỉnh sửa.");
        // Bạn có thể điều hướng người dùng đến trang khác nếu cần
        router.push(`/profile/${id}`);
      } else {
        // Nếu có lỗi từ API, thông báo lỗi
        Alert.alert("Lỗi", data.message || "Có lỗi xảy ra khi lưu thông tin.");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu thông tin.");
    }
  };

  const goToAllReports = () => {
    router.push(`/reports/user/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "Edit Profile",
        }}
      />
      <View style={styles.innerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {[ 
            { label: "Họ và tên", field: "first_name" },
            { label: "Tên", field: "last_name" },
            { label: "Email", field: "email", keyboardType: "email-address" },
            { label: "Giới tính", field: "gender" },
            { label: "Hạng mục", field: "category" },
          ].map(({ label, field, keyboardType }) => (
            <View style={styles.inputGroup} key={field}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={formData[field]}
                onChangeText={(value) => handleInputChange(field, value)}
                keyboardType={keyboardType}
              />
            </View>
          ))}

          {/* Không cho phép chỉnh sửa số điện thoại và vai trò */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              editable={false} // Không cho phép chỉnh sửa
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vai trò</Text>
            <TextInput
              style={styles.input}
              value={formData.role}
              editable={false} // Không cho phép chỉnh sửa
            />
          </View>

          <TouchableOpacity style={styles.seeReportsButton} onPress={goToAllReports}>
            <Text style={styles.seeReportsButtonText}>Xem tất cả báo cáo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollContainer: {
    alignItems: "center",
  },
  inputGroup: {
    marginBottom: 12,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    width: "100%",
    backgroundColor: "#F9F9F9",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  seeReportsButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  seeReportsButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProfileScreen;
