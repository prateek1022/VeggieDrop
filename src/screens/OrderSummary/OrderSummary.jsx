import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

export const OrderSummary = () => {
  const route = useRoute();
  const { orderData } = route.params || {};

  if (!orderData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No order data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Order Status: {orderData.status.toUpperCase()}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <Text style={styles.addressText}>
            {orderData.address.type} - {orderData.address.completeAddress}
          </Text>
        </View>

        {/* Product List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ordered Items</Text>
          {orderData.products.map((product, index) => (
            <View key={index} style={styles.productContainer}>
              <Image source={{ uri: product.banner }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productInfo}>{product.brand} - {product.weight}</Text>
                <Text style={styles.productPrice}>₹{product.price} x {product.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <Text style={styles.paymentText}>Payment Mode: {orderData.payment_mode}</Text>
          <Text style={styles.paymentText}>Payment Method: {orderData.payment_method}</Text>
          <Text style={styles.paymentText}>Total Amount: ₹{orderData.total}</Text>
          <Text style={[styles.paymentStatus, orderData.payment_done ? styles.successText : styles.pendingText]}>
            {orderData.payment_done ? "Payment Completed" : "Payment Pending"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5f7e9", // Light Green Background
    padding: 15,
  },
  statusContainer: {
    backgroundColor: "#1f7a1f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  statusText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f7a1f",
  },
  addressText: {
    fontSize: 14,
    color: "#555",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f7a1f",
  },
  productInfo: {
    fontSize: 13,
    color: "#666",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  paymentText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  paymentStatus: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  successText: {
    color: "#1f7a1f",
  },
  pendingText: {
    color: "#d9534f",
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
    marginTop: 20,
  },
});
