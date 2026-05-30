import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSnippets } from '../hooks/useSnippets';
import { Snippet } from '../types';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const { snippets, loading, error, getFavorites, toggleFavorite } = useSnippets();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Snippet[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favSnippets = await getFavorites();
      setFavorites(favSnippets);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Snippet }) => (
    <TouchableOpacity
      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}
      onPress={() => router.push(`/snippet-details/${item.id}`)}
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
          <Feather name="star" size={20} color="#ffd700" />
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
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
          Favorite Snippets
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No favorite snippets yet</Text>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}