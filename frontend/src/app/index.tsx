import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

import { getAllQuestions } from "../services/questionService";
import { Question } from "../services/types";

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllQuestions();

      setQuestions(data);
    } catch (error) {
      console.error("Erro ao carregar questões:", error);
      setError("Não foi possível carregar as questões.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar questões através da pesquisa
  const filteredQuestions = questions.filter((question) => {
    const searchText = search.toLowerCase();

    return (
      question.title.toLowerCase().includes(searchText) ||
      question.content.toLowerCase().includes(searchText) ||
      question.authorName.toLowerCase().includes(searchText) ||
      question.area.toLowerCase().includes(searchText)
    );
  });

  return (
    <LinearGradient
      colors={["#bbc4e6ff", "#181698ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >

      {/* Perguntas */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#ffffff"
          />

          <Text style={styles.loadingText}>
            A carregar perguntas...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadQuestions}
          >
            <Text style={styles.retryButtonText}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredQuestions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}

          renderItem={({ item }) => (
            <View style={styles.questionCard}>

              {/* Título da questão */}
              <Text style={styles.question}>
                {item.title}
              </Text>

              {/* Conteúdo da questão */}
              <Text style={styles.content}>
                {item.content}
              </Text>

              {/* Informação */}
              <View style={styles.info}>
                <Text style={styles.author}>
                  Por: {item.authorName}
                </Text>

                <Text style={styles.area}>
                  {item.area}
                </Text>
              </View>

              {/* Número de respostas */}
              <Text style={styles.answersCount}>
                {item.answersCount === 1
                  ? "1 resposta"
                  : `${item.answersCount} respostas`}
              </Text>

            </View>
          )}

          // Caso a pesquisa não encontre nada
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {search
                  ? "Nenhuma pergunta encontrada."
                  : "Ainda não existem perguntas."}
              </Text>
            </View>
          }

          // Botão no fim das perguntas
          ListFooterComponent={
            filteredQuestions.length > 0 ? (
              <Pressable style={styles.askButton}>
                <Text style={styles.plus}>
                  +
                </Text>

                <Text style={styles.askButtonText}>
                  Fazer pergunta
                </Text>
              </Pressable>
            ) : null
          }
        />
      )}

      {/* TopBar sobreposto */}
      <View style={styles.topBar}>

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar perguntas..."
          placeholderTextColor="#888888"
          value={search}
          onChangeText={setSearch}
        />

        <Pressable style={styles.searchButton}>
          <Text style={styles.searchButtonText}>
            🔍
          </Text>
        </Pressable>

      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 120,
  },

  questionCard: {
    width: "100%",

    padding: 20,
    marginBottom: 16,

    borderRadius: 20,

    borderColor: "#888888",
    borderWidth: 3,

    backgroundColor: "#2738a4ff",
  },

  question: {
    fontSize: 17,
    fontWeight: "600",

    color: "#ffffffff",

    marginBottom: 12,
  },

  content: {
    fontSize: 14,
    lineHeight: 21,

    color: "#cccccc",
  },

  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 15,
  },

  author: {
    fontSize: 12,
    color: "#aaaaaa",
  },

  area: {
    fontSize: 12,
    color: "#dddddd",

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 12,

    backgroundColor: "#414fc0",
  },

  answersCount: {
    marginTop: 10,

    fontSize: 12,
    color: "#aaaaaa",
  },

  // Botão "Fazer pergunta"
  askButton: {
    height: 58,

    marginTop: 4,
    marginBottom: 20,

    borderRadius: 29,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#ffeeeeff",
  },

  plus: {
    fontSize: 28,
    fontWeight: "400",

    color: "#323232ff",

    marginRight: 8,
    marginTop: -2,
  },

  askButtonText: {
    fontSize: 16,
    fontWeight: "600",

    color: "#323232ff",
  },

  // TopBar
  topBar: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    height: 80,

    paddingHorizontal: 20,
    paddingTop: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#aab6e3ff",
  },

  searchInput: {
    flex: 1,

    height: 48,

    paddingHorizontal: 18,

    borderRadius: 24,

    backgroundColor: "#ffeeeeff",

    color: "#323232ff",

    fontSize: 15,
  },

  searchButton: {
    width: 48,
    height: 48,

    marginLeft: 8,

    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#ffeeeeff",
  },

  searchButtonText: {
    fontSize: 20,
  },

  // Loading
  center: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    padding: 20,
  },

  loadingText: {
    marginTop: 10,

    fontSize: 14,
    color: "#ffffff",
  },

  // Erro
  errorText: {
    fontSize: 15,

    color: "#ffffff",

    textAlign: "center",

    marginBottom: 20,
  },

  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 20,

    backgroundColor: "#ffeeeeff",
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",

    color: "#323232ff",
  },

  // Sem resultados
  emptyContainer: {
    alignItems: "center",

    paddingTop: 40,
  },

  emptyText: {
    fontSize: 15,

    color: "#ffffff",

    textAlign: "center",
  },
});
