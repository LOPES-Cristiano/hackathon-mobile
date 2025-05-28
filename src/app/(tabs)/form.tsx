import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '../../components/Button';
import { Colors } from '../../constants/Colors';

const genres = [
  'Ação',
  'Suspense',
  'Comédia',
  'Romance',
  'Terror',
  'Policial',
  'Educacional',
];

export default function Form() {
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  // Recupera preferências salvas ao abrir o formulário
  useEffect(() => {
    AsyncStorage.getItem('userGenres').then((saved: string | null) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSelected(parsed);
        } catch {}
      } else if (params.selected) {
        try {
          const parsed = JSON.parse(params.selected as string);
          if (Array.isArray(parsed)) setSelected(parsed);
        } catch {}
      }
    });
  }, [params.selected]);

  function toggleGenre(genre: string) {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  function handleSubmit() {
    AsyncStorage.setItem('userGenres', JSON.stringify(selected)).then(() => {
      router.replace({ pathname: '/(tabs)', params: { genres: JSON.stringify(selected) } });
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Escolha seus gêneros favoritos</Text>
      <Text style={styles.subtitle}>Personalize suas recomendações de filmes</Text>
      <View style={styles.genresContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[styles.genre, selected.includes(genre) && styles.genreSelected]}
            onPress={() => toggleGenre(genre)}
            activeOpacity={0.85}
          >
            <Text style={[styles.genreText, selected.includes(genre) && styles.genreTextSelected]}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Salvar preferências" onPress={handleSubmit} style={styles.saveButton} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 12,
    marginTop: 18,
    paddingHorizontal: 8,
  },
  genre: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 12,
    margin: 4,
    borderWidth: 1.5,
    borderColor: Colors.genreBorder,
    minWidth: 90,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  genreSelected: {
    backgroundColor: Colors.genreSelected,
    borderColor: Colors.primary,
    elevation: 2,
    shadowOpacity: 0.15,
  },
  genreText: {
    color: Colors.genreText,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  genreTextSelected: {
    color: Colors.genreTextSelected,
  },
  subtitle: {
    color: Colors.subtitle,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  title: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 2,
    textAlign: 'center',
    marginTop: 38,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingTop: 0,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },
});