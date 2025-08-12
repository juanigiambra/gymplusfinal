import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ProfileImageEditorProps {
  profileImage: string | null;
  onEdit: () => void;
}

export default function ProfileImageEditor({ profileImage, onEdit }: ProfileImageEditorProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.profileImageCircle}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.addPhotoText}>+</Text>
        )}
      </View>
      <TouchableOpacity style={styles.editPhotoButton} onPress={onEdit}>
        <FontAwesome name="pencil" size={20} color="#357ae8" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImageCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eaf2ff',
    borderWidth: 2,
    borderColor: '#357ae8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32, // Más margen debajo del círculo
    marginTop: 8,
    overflow: 'hidden',
  },
  profileImage: {
    width: 146,
    height: 146,
    borderRadius: 73,
  },
  addPhotoText: {
    color: '#357ae8',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: -18, // Más separación respecto al círculo
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
});
