import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { ScreenHeaderBtn } from "../../../components";
import { COLORS, icons } from "../../../constants";
import { Stack, useRouter, useSearchParams } from "expo-router";

const AllReportsScreen = () => {
  const { id } = useSearchParams();  // Lấy id từ URL params
  
  const [reports, setReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `http://203.145.47.225:8080/reports/user/${id}`  // Sử dụng id từ params
        );
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    if (id) {
      fetchReports();
    }
  }, [id]);  // Chạy lại khi id thay đổi

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      weekday: "long", // e.g., "Monday"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "December"
      day: "numeric", // e.g., "10"
      hour: "numeric", // e.g., "4"
      minute: "numeric", // e.g., "39"
      second: "numeric", // e.g., "43"
      hour12: false, // 24-hour format
    });
  };

  const handleDeleteReport = async (reportId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa báo cáo này không?",
      [
        {
          text: "Quay lại",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const response = await fetch(
                `http://203.145.47.225:8080/reports/${reportId}/remove`,
                {
                  method: "DELETE",
                }
              );
              if (response.ok) {
                setReports((prevReports) =>
                  prevReports.filter((report) => report.id !== reportId)
                );
                alert("Đã xóa báo cáo này thành công!");
              } else {
                alert("Xóa báo cáo thất bại!");
              }
            } catch (error) {
              console.error("Lỗi trong quá trình xóa:", error);
            }
          },
        },
      ]
    );

   
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "All Reports",
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {reports.length === 0 ? (
          <Text style={styles.noReportsText}>Bạn chưa có báo cáo nào</Text>
        ) : (
          reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.reportTitle}>
                  Report ID: #{report.id.slice(-5)}
                </Text>
              </View>
              <Text style={styles.reportDetails}>
                {report.Weight} (kg) - {report.RemainingFill} (%) - {report.AirQuality} (ppm)
              </Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
              {report.image && (
                <Image
                  source={{ uri: report.image }}
                  style={styles.reportImage}
                />
              )}
              <Text style={styles.reportDetails}>
                Địa chỉ: {report.Address || "N/A"}
              </Text>
              <Text style={styles.reportDetails}>
                Tọa độ: {report.Latitude}{" - "}{report.Longitude}
              </Text>
              <Text style={styles.reportDetails}>
                  Thời gian: {formatDate(report.created_at)}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteReport(report.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding: 16,
  },
  noReportsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  reportCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    minHeight: 100,
    shadowColor: "#E5F6E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "column",
  },
  cardHeader: {
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  reportDescription: {
    fontSize: 16,
    marginVertical: 10,
    color: "#777",
  },
  reportImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  reportDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
});

export default AllReportsScreen;
