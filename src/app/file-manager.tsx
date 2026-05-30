import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Snippet } from '../types';

export default function FileManagerScreen() {
  const router = useRouter();
  const [files, setFiles] = useState<Array<{name: string; path: string; isDirectory: boolean; size: number; modified: number}>>([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(FileSystem.documentDirectory);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [itemToRename, setItemToRename] = useState<{name: string; path: string; isDirectory: boolean} | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{name: string; path: string; isDirectory: boolean} | null>(null);

  useEffect(() => {
    loadDirectoryContents();
  }, [currentPath]);

  const loadDirectoryContents = async () => {
    try {
      setLoading(true);
      const info = await FileSystem.getInfoAsync(currentPath);
      if (!info.exists) {
        // If directory doesn't exist, create it
        await FileSystem.makeDirectoryAsync(currentPath, { intermediates: true });
      }
      
      const contents = await FileSystem.readDirectoryAsync(currentPath);
      const fileDetails = await Promise.all(
        contents.map(async (item) => {
          const fullPath = `${currentPath}${item}`;
          const stats = await FileSystem.getInfoAsync(fullPath);
          return {
            name: item,
            path: fullPath,
            isDirectory: stats.isDirectory,
            size: stats.size,
            modified: stats.modificationTime,
          };
        })
      );
      
      // Sort: directories first, then files, alphabetically
      fileDetails.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setFiles(fileDetails);
    } catch (error) {
      console.error('Error loading directory contents:', error);
      alert('Failed to load directory contents');
    } finally {
      setLoading(false);
    }
  };

  const goUp = async () => {
    const parent = FileSystem.getParentDirectory(currentPath);
    if (parent && parent !== currentPath) {
      setCurrentPath(parent);
    }
  };

  const handlePressItem = async (item: typeof files[0]) => {
    if (item.isDirectory) {
      setCurrentPath(item.path);
    } else {
      // For files, we could open them or show options
      // For now, just show an alert
      alert(`File: ${item.name}\nPath: ${item.path}`);
    }
  };

  const handleRename = () => {
    setItemToRename(null);
    setRenameInput('');
    setShowRenameModal(false);
    
    if (!itemToRename) return;
    
    const newPath = `${FileSystem.getParentDirectory(itemToRename.path)}/${renameInput}`;
    FileSystem.moveAsync({
      from: itemToRename.path,
      to: newPath,
    })
    .then(() => {
      loadDirectoryContents();
    })
    .catch((error) => {
      console.error('Error renaming item:', error);
      alert('Failed to rename item');
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    
    if (!itemToDelete) return;
    
    FileSystem.deleteAsync(itemToDelete.path, { idempotent: true })
    .then(() => {
      loadDirectoryContents();
    })
    .catch((error) => {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    });
  };

  const renderItem = ({ item }: { item: typeof files[0] }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => handlePressItem(item)}
      style={{ 
        padding: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <MaterialCommunityIcons
        name={item.isDirectory ? 'folder' : 'insert-drive-file'}
        size={24}
        color={item.isDirectory ? '#2196F3' : '#9E9E9E'}
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: item.isDirectory ? 'bold' : 'normal' }}>{item.name}</Text>
        <Text style={{ fontSize: 12, color: '#666' }}>
          {item.isDirectory ? 'Folder' : `${(item.size / 1024).toFixed(1)} KB`}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="dots-vertical"
        size={20}
        color="#9E9E9E"
        style={{ marginLeft: 12 }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ 
        padding: 16, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>File Manager</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={goUp} disabled={currentPath === FileSystem.documentDirectory}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 8, fontSize: 14, color: '#666' }}>
            {currentPath.replace(FileSystem.documentDirectory, '') || '/'}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.path}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: 24,
            }}>
              <MaterialCommunityIcons name="folder-outline" size={48} color="#e0e0e0" />
              <Text style={{ marginTop: 16, color: '#666' }}>No files in this directory</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Rename Modal */}
      <Modal 
        visible={showRenameModal} 
        transparent={true} 
        animationType="fade"
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            padding: 24, 
            borderRadius: 12, 
            width: '80%',
            maxWidth: 400
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Rename Item
            </Text>
            <TextInput
              value={renameInput}
              onChangeText={setRenameInput}
              placeholder="Enter new name"
              style={{ 
                height: 40, 
                borderColor: '#ccc', 
                borderWidth: 1, 
                borderRadius: 4, 
                paddingHorizontal: 12,
                marginBottom: 16,
              }}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button 
                title="Cancel" 
                onPress={() => {
                  setShowRenameModal(false);
                  setItemToRename(null);
                  setRenameInput('');
                }}
              />
              <Button 
                title="Rename" 
                color="#007AFF"
                onPress={handleRename}
                disabled={!renameInput.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        visible={showDeleteConfirm} 
        transparent={true} 
        animationType="fade"
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            padding: 24, 
            borderRadius: 12, 
            width: '80%',
            maxWidth: 400
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Delete Item
            </Text>
            <Text style={{ marginBottom: 24 }}>
              Are you sure you want to delete "{itemToDelete?.name}"?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button 
                title="Cancel" 
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
              />
              <Button 
                title="Delete" 
                color="#ff3b30"
                onPress={handleDelete}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}