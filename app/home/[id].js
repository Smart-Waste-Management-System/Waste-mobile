import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useFocusEffect, useSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

import { useRouter } from "expo-router";
import { ScreenHeaderBtn } from "../../components";
import { COLORS, icons, images } from "../../constants";

const HomeScreen = () => {
  const { id } = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [wasteBins, setWasteBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchWasteBins = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://14.225.255.120/wastebins/all");
      const data = await response.json();
      if (data.success) {
        setWasteBins(data.data);
      } else {
        console.error("Failed to fetch data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching waste bins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteBins();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedItem(null);
      setModalVisible(false);
      fetchWasteBins();
    }, [])
  );

  const handleSelectItem = async (id) => {
    setSelectedItem(id);
    try {
      const response = await fetch(`http://14.225.255.120/wastebins/${id}/info`);
      const data = await response.json();
      if (data.success) {
        setSelectedItemDetails(data.data);
        setModalVisible(true);
      } else {
        console.error("Failed to fetch item details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const handleCreateReport = (item) => {
    router.push({
      pathname: `/reports/${item.id}`,
      params: {
        weight: item.weight,
        remaining_fill: item.remaining_fill,
        air_quality: item.air_quality,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        timestamp: item.timestamp,
        user_id: id,
      },
    });
  };
  const handleMenuPress = () => {
    router.push("/newpage");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.menu}
              dimension="60%"
              handlePress={handleMenuPress}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={images.profile}
              dimension="100%"
              handlePress={() => router.push(`/profile/${id}`)}
            />
          ),
          headerTitle: "",
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Danh sách thùng rác</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : wasteBins.length > 0 ? (
          wasteBins.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => handleSelectItem(item.id)}
            >
              <View style={styles.listItemContent}>
                <View>
                  <Text style={styles.itemId}>ID: #{item.id.slice(-5)}</Text>
                  <Text style={styles.itemDetail}>Địa chỉ: {item.address}</Text>
                  <Text style={styles.itemDetail}>Trọng lượng: {item.weight} kg</Text>
                  <Text style={styles.itemDetail}>Mức độ đầy: {100 - item.remaining_fill} %</Text>
                </View>
                <Icon name="chevron-right" size={30} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>Không có dữ liệu</Text>
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItemDetails ? (
              <>
                <Text style={styles.modalTitle}>Chi tiết thùng rác #{selectedItemDetails.id.slice(-5)}</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.fieldText}>Trọng lượng:</Text>
                  <Text style={styles.valueText}>{selectedItemDetails.weight} kg</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.fieldText}>Dung tích còn lại:</Text>
                  <Text style={styles.valueText}>{selectedItemDetails.remaining_fill} %</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.fieldText}>Nồng độ khí thối:</Text>
                  <Text style={styles.valueText}>{selectedItemDetails.air_quality} ppm</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.fieldText}>Địa chỉ:</Text>
                  <Text style={styles.valueText}>{selectedItemDetails.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.fieldText}>Tọa độ:</Text>
                  <Text style={styles.valueText}>
                    ({selectedItemDetails.latitude}, {selectedItemDetails.longitude})
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.fieldText}>Thời gian:</Text>
                  <Text style={styles.valueText}>
                    {new Date(selectedItemDetails.timestamp).toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() => handleCreateReport(selectedItemDetails)}
                >
                  <Text style={styles.reportButtonText}>Tạo báo cáo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollContainer: {
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  listItem: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  itemId: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.dark,
  },
  itemDetail: {
    color: COLORS.lightWhite,
    fontSize: 14,
    marginTop: 4,
  },
  noDataText: {
    textAlign: "center",
    color: COLORS.gray,
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  fieldText: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.dark,
    flex: 1,
  },
  valueText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "right",
    flex: 1,
  },
  reportButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  reportButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
  },
  closeButtonText: {
    color: COLORS.secondary,
    fontWeight: "bold",
  },
});

export default HomeScreen;
