import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const questions = [
  {
    id: "1",
    question: "O que é a terapia da fala?",
    answer:
      "A terapia da fala é uma área da saúde que trabalha a comunicação, linguagem, voz, fala e deglutição.",
  },
  {
    id: "2",
    question: "Quais são as áreas da terapia da fala?",
    answer:
      "Entre as principais áreas estão a linguagem, fala, voz, comunicação e deglutição.",
  },
  {
    id: "3",
    question: "Quando devo procurar um terapeuta da fala?",
    answer:
      "Pode ser indicado procurar um terapeuta da fala quando existem dificuldades na comunicação, fala, linguagem ou voz.",
  },
  {
    id: "4",
    question: "A terapia da fala é só para crianças?",
    answer:
      "Não. A terapia da fala pode ser realizada por crianças, adolescentes, adultos e idosos.",
  },
  {
    id: "5",
    question: "O que é uma alteração da linguagem?",
    answer:
      "É uma dificuldade que pode afetar a compreensão ou a utilização da linguagem.",
  },
  {
    id: "6",
    question: "O que é uma alteração da linguagem?",
    answer:
      "É uma dificuldade que pode afetar a compreensão ou a utilização da linguagem.",
  },
  {
    id: "7",
    question: "O que é uma alteração da linguagem?",
    answer:
      "É uma dificuldade que pode afetar a compreensão ou a utilização da linguagem.",
  },
];

export default function Page() {
  return (
    <LinearGradient
      colors={["#bbc4e6ff", "#181698ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >

      {/* Perguntas */}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.questionCard}>

            <Text style={styles.question}>
              {item.question}
            </Text>

            <Text style={styles.answer}>
              {item.answer}
            </Text>

          </View>
        )}

        // Botão no fim das perguntas
        ListFooterComponent={
          <Pressable style={styles.askButton}>
            <Text style={styles.plus}>
              +
            </Text>

            <Text style={styles.askButtonText}>
              Fazer pergunta
            </Text>
          </Pressable>
        }
      />

      {/* TopBar sobreposto */}
      <View style={styles.topBar}>

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar perguntas..."
          placeholderTextColor="#888888"
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

  answer: {
    fontSize: 14,
    lineHeight: 21,
    color: "#cccccc",
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
});
