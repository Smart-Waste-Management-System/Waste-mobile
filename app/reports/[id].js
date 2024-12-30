import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { ScreenHeaderBtn } from "../../components";
import { Stack, useRouter, useSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { COLORS, icons } from "../../constants";

const ReportPage = () => {
  const params = useSearchParams(); // Get the wastebin_id from the route parameters
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCnN_498Audq_-qO3QrERd_itCWizYxnnF9w&s"); // Link ảnh cố định
  const router = useRouter();

  // const handleImagePicker = async () => {
  //   try {
  //     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!permissionResult.granted) {
  //       Alert.alert("Cần quyền truy cập", "Bạn cần cho phép truy cập thư viện ảnh.");
  //       return;
  //     }
  
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ['image'], // Replace deprecated MediaTypeOptions with an array
  //       allowsEditing: true,
  //       quality: 1,
  //     });
  
  //     if (!result.canceled && result.assets?.length > 0) {
  //       setEvidence(result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi chọn ảnh:", error);
  //     Alert.alert("Lỗi", "Không thể chọn ảnh.");
  //   }
  // };
  
  
  const handleSave = async () => {
    try {
      const response = await fetch("http://14.225.255.120/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: params.user_id,
          wastebin_id: params.id,
          description: description || null,
          image: evidence || null, 
        }),
      });
  
      if (response.ok) {
        Alert.alert("Thành công", "Tạo báo cáo thành công!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        console.log("Lỗi");
        Alert.alert("Lỗi", "Lỗi trong quá trình tạo báo cáo.");
      }
    } catch (error) {
      console.error("Lỗi lưu báo cáo:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình lưu báo cáo.");
    }
  };
  
  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Lỗi", "Không thể mở Google Maps.");
    });
  };
  
  if (!params || Object.keys(params).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Đang tải báo cáo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "Transaction",
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
        }}
      />
      {/* Tiêu đề "Báo cáo dữ liệu" */}
      <Text style={styles.pageTitle}>Báo cáo dữ liệu</Text>
      
      <View style={styles.card}>
        <Text style={styles.labelBold}>
          ID: <Text style={styles.label}>#{params.id.slice(-5)}</Text>
        </Text>
        <Text style={styles.labelBold}>
          Địa chỉ: <Text style={styles.label}>{params.address}</Text>
        </Text>
        <Text style={styles.labelBold}>
          Chất lượng không khí (H2S): <Text style={styles.label}>{params.air_quality}</Text>
        </Text>
        <Text style={styles.labelBold}>
          Mức độ đầy: <Text style={styles.label}>{100 - params.remaining_fill}%</Text>
        </Text>
        <Text style={styles.labelBold}>
          Cân nặng: <Text style={styles.label}>{params.weight} kg</Text>
        </Text>
        <Text style={styles.labelBold}>
            Toạ độ: <Text style={styles.label}>{params.latitude} - {params.longitude}</Text>
        </Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => openGoogleMaps(params.latitude, params.longitude)}
        >
          <Text style={styles.mapButtonText}>Mở Google Maps</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.labelBold}>Mô tả:</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="Nhập mô tả"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.labelBold}>Minh chứng:</Text>
      {/* <TouchableOpacity
        style={styles.evidenceContainer}
        // onPress={handleImagePicker}
      >
        {evidence ? (
          <Image source={{ uri: evidence }} style={styles.evidenceImage} />
        ) : (
          <Text style={styles.evidencePlaceholder}>+</Text>
        )}
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.evidenceContainer}
        // onPress={handleImagePicker}
      >
        <Image source={{ uri: evidence }} style={styles.evidenceImage} />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Default Image</Text>
        </View>
      </TouchableOpacity>


      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F6E5",
    padding: 16,
    justifyContent: 'center',  // Căn giữa theo chiều dọc
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#A5D6A7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  labelBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
  },
  mapButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  evidenceContainer: {
    height: 150,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  evidenceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  evidencePlaceholder: {
    fontSize: 32,
    color: "#888",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Phủ toàn bộ vùng của ảnh
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen mờ
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  overlayText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReportPage;
