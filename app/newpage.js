import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Linking, ScrollView } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { COLORS } from "../constants";
import { Ionicons } from "@expo/vector-icons"; // Thêm thư viện icon

const NewPage = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchNearbyLocations(location.coords.latitude, location.coords.longitude);
    };

    getLocation();
  }, []);

  const fetchNearbyLocations = async (latitude, longitude) => {
    try {
      const response = await axios.post("http://14.225.255.120/wastebins/shortest", {
        start_latitude: latitude,
        start_longitude: longitude,
      });
      if (response.data.success) {
        setNearbyLocations(response.data.data);
      } else {
        setErrorMsg("Không thể lấy thông tin vị trí gần");
      }
    } catch (error) {
      setErrorMsg("Lỗi khi lấy dữ liệu");
    }
  };

  const handleReload = () => {
    if (location) {
      fetchNearbyLocations(location.coords.latitude, location.coords.longitude);
    }
  };

  const handleOpenMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  let text = "Đang chờ lấy vị trí...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Vĩ độ: ${location.coords.latitude.toFixed(4)}, Kinh độ: ${location.coords.longitude.toFixed(4)}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Đường đi thu gom ngắn nhất</Text>

      {/* Card Vị trí hiện tại */}
      <View style={styles.cardd}>
        <View style={styles.locationInfo}>
          <Text style={styles.cardTitle}>Vị trí hiện tại</Text>
          <Text style={styles.cardCoordinates}>{text}</Text>
        </View>
        {/* Nút reload bên phải */}
        <TouchableOpacity onPress={handleReload} style={styles.reloadButton}>
          <Ionicons name="reload" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Bọc danh sách trong ScrollView để có thể cuộn */}
      <ScrollView contentContainerStyle={styles.flatListContainer}>
        {nearbyLocations.length > 0 ? (
          nearbyLocations.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleOpenMap(item.latitude, item.longitude)}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>{item.address}</Text>
              <Text style={styles.cardLabel}>Trạng thái: {item.label}</Text>
              <Text style={styles.cardCoordinates}>
                Vĩ độ: {item.latitude}, Kinh độ: {item.longitude}
              </Text>
              <Ionicons name="ios-arrow-down" size={24} color={COLORS.primary} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.text}>Không tìm thấy vị trí gần</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    paddingTop: 20,
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 25,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  flatListContainer: {
    backgroundColor: "#E1F8D8",
    borderRadius: 12,
    padding: 10,
    width: "100%",
  },
  cardd: {
    backgroundColor: COLORS.white,
    padding: 18,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 18,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: 330,
    height: 150, // Cố định chiều cao của item
    justifyContent: "space-between", // Căn giữa các phần tử
  },
  locationInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  cardCoordinates: {
    fontSize: 14,
    color: COLORS.gray,
  },
  reloadButton: {
    padding: 8,
  },
  arrowIcon: {
    marginTop: 10,
    alignSelf: "center",
  },
});

export default NewPage;
