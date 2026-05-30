import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSnippets } from '../hooks/useSnippets';
import { Snippet } from '../types';
import { useNavigation, useRoute } from '@react-navigation/native';

export const CreateSnippetScreen = () => {
  const { addSnippet, loading, error } = useSnippets();
  const navigation = useNavigation();
  const route = useRoute();
  
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !code.trim() || !language.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await addSnippet({
        title: title.trim(),
        code: code.trim(),
        language: language.trim(),
        tags,
        isFavorite: false,
      });
      // Go back to home screen
      navigation.goBack();
    } catch (err) {
      alert('Failed to save snippet');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 4,
          paddingHorizontal: 8,
          marginBottom: 12,
        }}
      />
      
      <TextInput
        placeholder="Language (e.g., JavaScript, Python)"
        value={language}
        onChangeText={setLanguage}
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 4,
          paddingHorizontal: 8,
          marginBottom: 12,
        }}
      />
      
      <TextInput
        placeholder="Enter code..."
        value={code}
        onChangeText={setCode}
        style={{
          height: 200,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 4,
          padding: 8,
          textAlignVertical: 'top',
          marginBottom: 12,
          fontFamily: 'monospace',
        }}
        multiline
      />
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TextInput
          placeholder="Add tag"
          value={newTag}
          onChangeText={setNewTag}
          style={{
            flex: 1,
            height: 35,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 8,
            marginRight: 8,
          }}
          onSubmitEditing={handleAddTag}
        />
        <TouchableOpacity onPress={handleAddTag} style={{ padding: 8 }}>
          <Feather name="plus" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {tags.length > 0 && (
        <View style={{ flexWrap: 'row', marginBottom: 16 }}>
          {tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: '#eee',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity onPress={handleSave} style={{
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
      }} disabled={isSaving}>
        {isSaving ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Snippet</Text>
        )}
      </TouchableOpacity>
      
      {error && (
        <View style={{ marginTop: 12, padding: 8, backgroundColor: '#ffe6e6', borderRadius: 4 }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      )}
    </View>
  );
};