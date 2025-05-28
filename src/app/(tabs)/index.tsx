import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MovieCard from '../../components/moviecard';
import Button from '../../components/Button';
import { Colors } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const genres = [
	'Ação',
	'Suspense',
	'Comédia',
	'Romance',
	'Terror',
	'Policial',
	'Educacional',
];

const SUPABASE_URL = 'https://qeshafuubwtpsgkfympk.supabase.co/rest/v1/filmes';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlc2hhZnV1Ynd0cHNna2Z5bXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTE5OTksImV4cCI6MjA2Mzk2Nzk5OX0.rWwPf21NyBtsMueTL2K1gkFynbzPHfldgpnB2PWxHbo';

export default function Index() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [filmes, setFilmes] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

	useEffect(() => {
		if (params.genres) {
			try {
				const parsed = JSON.parse(params.genres as string);
				setSelectedGenres(Array.isArray(parsed) ? parsed : []);
			} catch {
				setSelectedGenres([]);
			}
		} else {
			setSelectedGenres([]);
		}
	}, [params.genres]);

	useEffect(() => {
		async function fetchFilmes() {
			setLoading(true);
			try {
				const res = await fetch(SUPABASE_URL, {
					headers: {
						apikey: SUPABASE_KEY,
						Authorization: `Bearer ${SUPABASE_KEY}`,
					},
				});
				const data = await res.json();
				setFilmes(data);
			} catch (e) {
				setFilmes([]);
			}
			setLoading(false);
		}
		fetchFilmes();
	}, []);

	function getFilmesByGenero(genero: string) {
		return filmes.filter(filme => filme.genero && filme.genero.includes(genero));
	}

	const genresToShow = selectedGenres.length > 0 ? selectedGenres : genres;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Text style={styles.groupTitle}>GRUPO 8</Text>
				</View>
				<View style={{ position: 'absolute', right: 16, top: 24 }}>
					<Button
						title="Limpar"
						onPress={async () => {
							await AsyncStorage.removeItem('userGenres');
							setSelectedGenres([]);
							router.replace({ pathname: '/(tabs)' });
						}}
						style={styles.clearButton}
					/>
				</View>
			</View>
			<Text style={styles.header}>Sugestão de Filmes</Text>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				{genresToShow.map((genre, idx) => (
					<View key={idx} style={styles.section}>
						<Text style={styles.sectionTitle}>{genre}</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
							{loading ? (
								<ActivityIndicator color="#4FC3F7" style={{ marginTop: 20 }} />
							) : (
								getFilmesByGenero(genre).map((filme) => (
									<MovieCard
										key={filme.id}
										img={filme.imagem ? { uri: filme.imagem } : require('../../../assets/images/icon.png')}
										title={filme.nome}
									/>
								))
							)}
						</ScrollView>
					</View>
				))}
			</ScrollView>
			<Button
				title="Diga o que você gosta"
				onPress={() => router.push({ pathname: '/form', params: { selected: JSON.stringify(selectedGenres) } })}
				style={styles.button}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		position: 'relative',
	},
	scrollContent: {
		paddingBottom: 100,
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
	header: {
		color: Colors.accent,
		fontWeight: 'bold',
		fontSize: 22,
		marginTop: 8,
		marginBottom: 18,
		textAlign: 'center',
		letterSpacing: 0.5,
	},
	section: {
		marginBottom: 18,
		paddingHorizontal: 0,
	},
	sectionTitle: {
		color: Colors.accent,
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 8,
		marginTop: 10,
		letterSpacing: 0.5,
		paddingLeft: 16,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: 10,
	},
	card: {
		width: 120,
		height: 170,
		backgroundColor: Colors.card,
		borderRadius: 14,
		marginRight: 16,
		overflow: 'hidden',
		elevation: 2,
		borderWidth: 1,
		borderColor: Colors.border,
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	button: {
		position: 'absolute',
		bottom: 24,
		left: 24,
		right: 24,
	},
	horizontalScroll: {
		paddingBottom: 8,
		paddingLeft: 8,
	},
	topBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 70,
		paddingTop: 24,
		paddingHorizontal: 16,
		marginBottom: 8,
		position: 'relative',
	},
	groupTitle: {
		color: Colors.accent,
		fontWeight: 'bold',
		fontSize: 28,
		textAlign: 'center',
		letterSpacing: 1,
	},
	clearButton: {
		position: 'absolute',
		right: 0,
		top: 0,
		backgroundColor: Colors.card,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 18,
		elevation: 0,
		shadowOpacity: 0,
		minWidth: 0,
	},
});