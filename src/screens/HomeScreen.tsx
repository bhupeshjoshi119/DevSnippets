import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSnippets } from '../hooks/useSnippets';
import { Snippet } from '../types';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const { snippets, loading, error, refreshSnippets, deleteSnippet, toggleFavorite } = useSnippets();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshSnippets();
    setRefreshing(false);
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderItem = ({ item }: { item: Snippet }) => (
    <TouchableOpacity
      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}
      onPress={() => navigation.navigate('SnippetDetails', { snippetId: item.id })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', flexShrink: 1 }}>{item.title}</Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          style={{ padding: 4 }}
        >
          <Feather name={item.isFavorite ? 'star' : 'star-outline'} size={20} color={item.isFavorite ? '#ffd700' : '#ccc'} />
        </TouchableOpacity>
      </View>
      <Text style={{ color: '#666', marginTop: 4 }}>{item.language}</Text>
      <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
        {item.tags.map(tag => `#${tag}`).join(' ')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
        <TouchableOpacity onPress={handleRefresh} style={{ marginTop: 8 }}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          placeholder="Search snippets..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{
            flex: 1,
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 16,
          }}
        />
        <TouchableOpacity onPress={() => navigation.navigate('CreateSnippet')} style={{ marginLeft: 8 }}>
          <Feather name="plus-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {searchTerm && (
        <TouchableOpacity onPress={() => setSearchTerm('')} style={{ padding: 16 }}>
          <Text>Clear search</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredSnippets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No snippets found</Text>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};