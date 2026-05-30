import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load theme from AsyncStorage
      const theme = await AsyncStorage.getItem('app-theme');
      setIsDarkMode(theme === 'dark');

      // Load API key from SecureStore
      const key = await SecureStore.getItemAsync('apiKey');
      setApiKey(key || '');
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async (value) => {
    setIsDarkMode(value);
    try {
      await AsyncStorage.setItem('app-theme', value ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
      Alert.alert('Failed to save theme preference');
    }
  };

  const saveApiKey = async () => {
    setSaving(true);
    try {
      await SecureStore.setItemAsync('apiKey', apiKey);
      Alert.alert('Success', 'API key saved securely');
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Failed', 'Could not save API key');
    } finally {
      setSaving(false);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all snippets and files? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear snippets from SQLite
              const db = require('expo-sqlite').openDatabase('snippets.db');
              await new Promise((resolve, reject) => {
                db.transaction(
                  (tx) => {
                    tx.executeSql('DELETE FROM snippets;', [], () => {
                      resolve();
                    }, (_, error) => {
                      reject(error);
                    });
                  },
                  (error) => {
                    reject(error);
                  },
                  () => {
                    resolve();
                  }
                );
              });

              // Clear files from document directory
              const { FileSystem } = await import('expo-file-system');
              const contents = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
              await Promise.all(
                contents.map(async (item) => {
                  const fullPath = `${FileSystem.documentDirectory}${item}`;
                  const info = await FileSystem.getInfoAsync(fullPath);
                  if (info.isDirectory) {
                    await FileSystem.deleteAsync(fullPath, { idempotent: true });
                  } else {
                    await FileSystem.deleteAsync(fullPath, { idempotent: true });
                  }
                })
              );

              Alert.alert('Success', 'All data has been cleared');
              // Refresh the screens if needed (we could use a context or event, but for simplicity we'll just notify)
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Failed', 'Could not clear all data');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Settings</Text>
      </View>

      {/* Theme Section */}
      <View style={{ 
        padding: 16, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 8, 
        marginBottom: 16 
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Appearance
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Text>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        </View>
      </View>

      {/* API Key Section */}
      <View style={{ 
        padding: 16, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 8, 
        marginBottom: 16 
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          API Key for AI Service
        </Text>
        <TextInput
          placeholder="Enter your API key"
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
          style={{ 
            height: 40, 
            borderColor: '#ccc', 
            borderWidth: 1, 
            borderRadius: 4, 
            paddingHorizontal: 12,
            marginBottom: 12,
          }}
        />
        <TouchableOpacity onPress={saveApiKey} style={{
          backgroundColor: '#007AFF',
          paddingVertical: 12,
          borderRadius: 4,
          alignItems: 'center',
        }} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Save API Key</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={{ 
        padding: 16, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 8 
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Danger Zone
        </Text>
        <TouchableOpacity onPress={clearAllData} style={{
          paddingVertical: 12,
          backgroundColor: '#ffe6e6',
          borderRadius: 4,
          alignItems: 'center',
        }}>
          <Text style={{ color: '#ff3b30', fontWeight: 'bold' }}>
            Clear All Data
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}