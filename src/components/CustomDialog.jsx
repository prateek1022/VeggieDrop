import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CustomDialog = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          {/* Cross Button on Border */}
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Image
              source={require('./cross-circle.png')} // Replace with your cross image file path
              style={styles.crossImage}
            />
          </TouchableOpacity>

          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}
          
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                <Text style={styles.confirmText}>Add to cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative', // Necessary for positioning the close button
  },
  closeButton: {
    position: 'absolute',
    top: -12, // Position the cross image slightly above the border
    right: -12, // Position the cross image slightly outside the right border
    zIndex: 2, // Ensure it appears above everything else
    backgroundColor: '#00000000', // Optional: Add a background to make it stand out
    borderRadius: 12, // Make the button circular
    padding: 5,
    elevation: 3, // Add a slight shadow for better visibility
  },
  crossImage: {
    width: 24, // Adjust to the size of your cross icon
    height: 24,
    //tintColor: '#999', // Optional: Adjust the color of the icon
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#FFB100',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomDialog;
