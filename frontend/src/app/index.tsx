import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import {
  getAllQuestions,
  createQuestion,
} from "../services/questionService";

import { getCurrentUserId } from "../services/sessionService";

import {
  Question,
  Area,
  CreateQuestionRequest,
} from "../services/types";

const AREAS: ("Todas" | Area)[] = [
  "Todas",
  "Voz",
  "Linguagem",
  "Fala",
  "Fluencia",
];

const QUESTION_AREAS: Area[] = [
  "Voz",
  "Linguagem",
  "Fala",
  "Fluencia",
];

export default function Page() {
  // ----------------------------------------
  // UTILIZADOR ATUAL
  // ----------------------------------------

  const { userId: routeUserId } = useLocalSearchParams<{
    userId?: string;
  }>();

  const [userId, setUserId] = useState<string | null>(null);

  const [loadingUser, setLoadingUser] = useState(true);

  // ----------------------------------------
  // PERGUNTAS
  // ----------------------------------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const [search, setSearch] = useState("");

  const [selectedArea, setSelectedArea] =
    useState<"Todas" | Area>("Todas");

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ----------------------------------------
  // LIKES LOCAIS
  // ----------------------------------------
  //
  // Guarda apenas os likes que o utilizador
  // adicionou nesta sessão.
  //
  // Exemplo:
  // {
  //   "id-da-pergunta": 1,
  //   "outra-pergunta": 1
  // }
  //
  // Não vai para o backend.
  // ----------------------------------------

  const [likedQuestions, setLikedQuestions] =
    useState<Record<string, boolean>>({});

  // ----------------------------------------
  // MODAL CRIAR PERGUNTA
  // ----------------------------------------

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [questionArea, setQuestionArea] =
    useState<Area>("Voz");

  const [creatingQuestion, setCreatingQuestion] =
    useState(false);

  // ----------------------------------------
  // CARREGAR SESSÃO ATUAL
  // ----------------------------------------

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const currentUserId =
          await getCurrentUserId();

        console.log(
          "Sessão atual:",
          currentUserId
        );

        setUserId(
          currentUserId ??
          routeUserId ??
          null
        );
      } catch (error) {
        console.error(
          "Erro ao carregar sessão:",
          error
        );
      } finally {
        setLoadingUser(false);
      }
    };

    loadCurrentUser();
  }, [routeUserId]);

  // ----------------------------------------
  // CARREGAR PERGUNTAS
  // ----------------------------------------

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getAllQuestions();

      console.log(
        "Perguntas carregadas:",
        data
      );

      setQuestions(data);
    } catch (error) {
      console.error(
        "Erro ao carregar questões:",
        error
      );

      setError(
        "Não foi possível carregar as questões."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // FILTRO
  // ----------------------------------------

  const filteredQuestions =
    questions.filter((question) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        question.title
          .toLowerCase()
          .includes(searchText) ||
        question.content
          .toLowerCase()
          .includes(searchText) ||
        question.authorName
          .toLowerCase()
          .includes(searchText);

      const matchesArea =
        selectedArea === "Todas" ||
        question.area === selectedArea;

      return (
        matchesSearch &&
        matchesArea
      );
    });

  // ----------------------------------------
  // LIKE
  // ----------------------------------------
  //
  // O número inicial vem do backend:
  //
  // answer.likesCount
  //
  // Depois o ❤️ adiciona/remove 1 localmente.
  // ----------------------------------------

  const toggleLike = (questionId: string) => {
    setLikedQuestions((current) => ({
      ...current,
      [questionId]: !current[questionId],
    }));
  };

  // ----------------------------------------
  // ABRIR MODAL
  // ----------------------------------------

  const openCreateModal = () => {
    console.log(
      "Abrir modal de criar pergunta"
    );

    console.log(
      "userId atual:",
      userId
    );

    setShowCreateModal(true);
  };

  // ----------------------------------------
  // CRIAR PERGUNTA
  // ----------------------------------------

  const handleCreateQuestion = async () => {
    console.log(
      "================================"
    );

    console.log(
      "A criar pergunta..."
    );

    console.log(
      "Sessão atual:",
      userId
    );

    console.log(
      "title:",
      title
    );

    console.log(
      "content:",
      content
    );

    console.log(
      "area:",
      questionArea
    );

    console.log(
      "================================"
    );

    // ----------------------------------------
    // VALIDAR USER ID
    // ----------------------------------------

    if (!userId) {
      Alert.alert(
        "Sessão inválida",
        "Não foi possível identificar o utilizador atual."
      );

      console.error(
        "userId não existe."
      );

      return;
    }

    // ----------------------------------------
    // VALIDAR TÍTULO
    // ----------------------------------------

    if (!title.trim()) {
      Alert.alert(
        "Título obrigatório",
        "Introduz um título para a pergunta."
      );

      return;
    }

    // ----------------------------------------
    // VALIDAR CONTEÚDO
    // ----------------------------------------

    if (!content.trim()) {
      Alert.alert(
        "Pergunta obrigatória",
        "Introduz o conteúdo da pergunta."
      );

      return;
    }

    try {
      setCreatingQuestion(true);

      // ----------------------------------------
      // DADOS DO POST
      // ----------------------------------------

      const data: CreateQuestionRequest = {
        title: title.trim(),
        content: content.trim(),
        authorId: userId,
        area: questionArea,
      };

      console.log(
        "Criando pergunta com authorId:",
        data.authorId
      );

      console.log(
        "========== QUESTION DEBUG =========="
      );

      console.log(
        JSON.stringify(data, null, 2)
      );

      console.log(
        "===================================="
      );

      console.log(
        "Dados enviados para POST /questions:",
        data
      );

      // ----------------------------------------
      // POST
      // ----------------------------------------

      const createdQuestion =
        await createQuestion(data);

      console.log(
        "Pergunta criada com sucesso:",
        createdQuestion
      );

      // ----------------------------------------
      // ADICIONAR À LISTA
      // ----------------------------------------

      setQuestions(
        (currentQuestions) => [
          createdQuestion,
          ...currentQuestions,
        ]
      );

      // ----------------------------------------
      // LIMPAR FORMULÁRIO
      // ----------------------------------------

      setTitle("");

      setContent("");

      setQuestionArea("Voz");

      // ----------------------------------------
      // FECHAR MODAL
      // ----------------------------------------

      setShowCreateModal(false);

      // ----------------------------------------
      // MENSAGEM
      // ----------------------------------------

      Alert.alert(
        "Pergunta criada",
        "A tua pergunta foi criada com sucesso."
      );
    } catch (error: any) {
      console.error(
        "================================"
      );

      console.error(
        "ERRO AO CRIAR PERGUNTA"
      );

      console.error(
        error
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "================================"
      );

      const message =
        error?.response?.data?.message ??
        error?.response?.data ??
        "Não foi possível criar a pergunta.";

      Alert.alert(
        "Erro",
        typeof message === "string"
          ? message
          : "Não foi possível criar a pergunta."
      );
    } finally {
      setCreatingQuestion(false);
    }
  };

  // ----------------------------------------
  // FECHAR MODAL
  // ----------------------------------------

  const closeCreateModal = () => {
    if (creatingQuestion) {
      return;
    }

    setTitle("");

    setContent("");

    setQuestionArea("Voz");

    setShowCreateModal(false);
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <LinearGradient
      colors={[
        "#bbc4e6ff",
        "#181698ff",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* -------------------------------- */}
      {/* PERGUNTAS */}
      {/* -------------------------------- */}

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
          keyExtractor={(item) =>
            item.id
          }
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }
          renderItem={({ item }) => {
            // ----------------------------------------
            // LIKES DAS RESPOSTAS
            // ----------------------------------------

            const backendLikes =
              item.answers.reduce(
                (total, answer) =>
                  total +
                  (answer.likesCount ?? 0),
                0
              );

            // ----------------------------------------
            // LIKE LOCAL
            // ----------------------------------------
            //
            // Se já clicámos no coração desta
            // pergunta, adicionamos +1.
            // ----------------------------------------

            const isLiked =
              likedQuestions[item.id] ?? false;

            const totalLikes =
              backendLikes +
              (isLiked ? 1 : 0);

            return (
              <View
                style={
                  styles.questionCard
                }
              >
                {/* TÍTULO */}

                <Text
                  style={
                    styles.question
                  }
                >
                  {item.title}
                </Text>

                {/* CONTEÚDO */}

                <Text
                  style={
                    styles.content
                  }
                >
                  {item.content}
                </Text>

                {/* INFORMAÇÃO */}

                <View
                  style={
                    styles.info
                  }
                >
                  <Text
                    style={
                      styles.author
                    }
                  >
                    Por: {item.authorName}
                  </Text>

                  <Text
                    style={
                      styles.area
                    }
                  >
                    {item.area}
                  </Text>
                </View>

                {/* RESPOSTAS E LIKES */}

                <View
                  style={
                    styles.statsRow
                  }
                >
                  <Text
                    style={
                      styles.answersCount
                    }
                  >
                    {item.answersCount === 1
                      ? "1 resposta"
                      : `${item.answersCount} respostas`}
                  </Text>

                  {/* CORAÇÃO */}

                  <Pressable
                    style={
                      styles.likeButton
                    }
                    onPress={() =>
                      toggleLike(item.id)
                    }
                  >
                    <Text
                      style={[
                        styles.heart,
                        isLiked &&
                        styles.heartLiked,
                      ]}
                    >
                      {isLiked
                        ? "❤️"
                        : "♡"}
                    </Text>

                    <Text
                      style={
                        styles.likesCount
                      }
                    >
                      {totalLikes}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View
              style={
                styles.emptyContainer
              }
            >
              <Text
                style={
                  styles.emptyText
                }
              >
                {search ||
                  selectedArea !== "Todas"
                  ? "Nenhuma pergunta encontrada."
                  : "Ainda não existem perguntas."}
              </Text>
            </View>
          }
          ListFooterComponent={
            !loading &&
              !error &&
              !loadingUser ? (
              <Pressable
                style={
                  styles.askButton
                }
                onPress={
                  openCreateModal
                }
              >
                <Text
                  style={
                    styles.plus
                  }
                >
                  +
                </Text>

                <Text
                  style={
                    styles.askButtonText
                  }
                >
                  Fazer pergunta
                </Text>
              </Pressable>
            ) : null
          }
        />
      )}

      {/* -------------------------------- */}
      {/* TOP BAR */}
      {/* -------------------------------- */}

      <View
        style={
          styles.topBar
        }
      >
        {/* PESQUISA */}

        <View
          style={
            styles.searchRow
          }
        >
          <TextInput
            style={
              styles.searchInput
            }
            placeholder="Pesquisar perguntas..."
            placeholderTextColor="#888888"
            value={search}
            onChangeText={
              setSearch
            }
          />
        </View>

        {/* ÁREAS */}

        <FlatList
          horizontal
          data={AREAS}
          keyExtractor={(item) =>
            item
          }
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.areaFilters
          }
          renderItem={({
            item,
          }) => {
            const selected =
              selectedArea === item;

            return (
              <Pressable
                style={[
                  styles.areaFilter,
                  selected &&
                  styles.areaFilterSelected,
                ]}
                onPress={() =>
                  setSelectedArea(
                    item
                  )
                }
              >
                <Text
                  style={[
                    styles.areaFilterText,
                    selected &&
                    styles.areaFilterTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* -------------------------------- */}
      {/* MODAL CRIAR PERGUNTA */}
      {/* -------------------------------- */}

      <Modal
        visible={
          showCreateModal
        }
        transparent
        animationType="fade"
        onRequestClose={
          closeCreateModal
        }
      >
        <View
          style={
            styles.modalBackground
          }
        >
          <View
            style={
              styles.modal
            }
          >
            {/* CABEÇALHO */}

            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                Fazer pergunta
              </Text>

              <Pressable
                onPress={
                  closeCreateModal
                }
                disabled={
                  creatingQuestion
                }
              >
                <Text
                  style={
                    styles.closeButton
                  }
                >
                  ×
                </Text>
              </Pressable>
            </View>

            {/* TÍTULO */}

            <Text
              style={
                styles.inputLabel
              }
            >
              Título
            </Text>

            <TextInput
              style={
                styles.input
              }
              placeholder="Ex: Como avaliar a fluência?"
              placeholderTextColor="#888888"
              value={title}
              onChangeText={
                setTitle
              }
              editable={
                !creatingQuestion
              }
              maxLength={150}
            />

            {/* PERGUNTA */}

            <Text
              style={
                styles.inputLabel
              }
            >
              Pergunta
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.contentInput,
              ]}
              placeholder="Escreve a tua pergunta..."
              placeholderTextColor="#888888"
              value={content}
              onChangeText={
                setContent
              }
              editable={
                !creatingQuestion
              }
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />

            {/* ÁREA */}

            <Text
              style={
                styles.inputLabel
              }
            >
              Área
            </Text>

            <FlatList
              horizontal
              data={
                QUESTION_AREAS
              }
              keyExtractor={(
                item
              ) => item}
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.modalAreas
              }
              renderItem={({
                item,
              }) => {
                const selected =
                  questionArea ===
                  item;

                return (
                  <Pressable
                    style={[
                      styles.modalArea,
                      selected &&
                      styles.modalAreaSelected,
                    ]}
                    onPress={() =>
                      setQuestionArea(
                        item
                      )
                    }
                    disabled={
                      creatingQuestion
                    }
                  >
                    <Text
                      style={[
                        styles.modalAreaText,
                        selected &&
                        styles.modalAreaTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />

            {/* CRIAR PERGUNTA */}

            <Pressable
              style={[
                styles.createButton,
                creatingQuestion &&
                styles.disabledButton,
              ]}
              onPress={
                handleCreateQuestion
              }
              disabled={
                creatingQuestion
              }
            >
              {creatingQuestion ? (
                <>
                  <ActivityIndicator
                    color="#ffffff"
                  />

                  <Text
                    style={
                      styles.loadingButtonText
                    }
                  >
                    A criar...
                  </Text>
                </>
              ) : (
                <Text
                  style={
                    styles.createButtonText
                  }
                >
                  Criar pergunta
                </Text>
              )}
            </Pressable>

            {/* CANCELAR */}

            <Pressable
              style={
                styles.cancelButton
              }
              onPress={
                closeCreateModal
              }
              disabled={
                creatingQuestion
              }
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// ========================================
// STYLES
// ========================================

const styles =
  StyleSheet.create({
    // ------------------------------------
    // CONTAINER
    // ------------------------------------

    container: {
      flex: 1,
    },

    // ------------------------------------
    // LISTA
    // ------------------------------------

    list: {
      paddingHorizontal: 20,
      paddingTop: 150,
      paddingBottom: 40,
    },

    // ------------------------------------
    // CARD DA PERGUNTA
    // ------------------------------------

    questionCard: {
      width: "100%",
      padding: 20,
      marginBottom: 16,
      borderRadius: 20,
      borderColor: "#888888",
      borderWidth: 3,
      backgroundColor:
        "#2738a4ff",
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
      justifyContent:
        "space-between",
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
      backgroundColor:
        "#414fc0",
    },

    answersCount: {
      fontSize: 12,
      color: "#aaaaaa",
    },

    // ------------------------------------
    // RESPOSTAS E LIKES
    // ------------------------------------

    statsRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginTop: 10,
    },

    likeButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
    },

    heart: {
      fontSize: 22,
      color: "#aaaaaa",
      marginRight: 5,
    },

    heartLiked: {
      fontSize: 22,
    },

    likesCount: {
      fontSize: 12,
      color: "#aaaaaa",
    },

    // ------------------------------------
    // BOTÃO FAZER PERGUNTA
    // ------------------------------------

    askButton: {
      width: "100%",
      height: 58,
      marginTop: 10,
      marginBottom: 100,
      borderRadius: 29,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#ffeeeeff",
      elevation: 8,
      shadowColor:
        "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5,
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

    // ------------------------------------
    // TOP BAR
    // ------------------------------------

    topBar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 130,
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor:
        "#aab6e3ff",
    },

    searchRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    searchInput: {
      flex: 1,
      height: 48,
      paddingHorizontal: 18,
      borderRadius: 24,
      backgroundColor:
        "#ffeeeeff",
      color: "#323232ff",
      fontSize: 15,
    },

    searchButton: {
      width: 48,
      height: 48,
      marginLeft: 8,
      borderRadius: 24,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#ffeeeeff",
    },

    searchButtonText: {
      fontSize: 20,
    },

    // ------------------------------------
    // FILTROS DE ÁREA
    // ------------------------------------

    areaFilters: {
      paddingTop: 20,
      paddingBottom: 4,
    },

    areaFilter: {
      paddingHorizontal: 19,
      paddingVertical: 10,
      marginRight: 8,
      borderRadius: 18,
      backgroundColor:
        "#d7dcf2",
    },

    areaFilterSelected: {
      backgroundColor:
        "#2738a4ff",
    },

    areaFilterText: {
      fontSize: 12,
      fontWeight: "500",
      color: "#323232",
    },

    areaFilterTextSelected: {
      color: "#ffffff",
      fontWeight: "600",
    },

    // ------------------------------------
    // MODAL
    // ------------------------------------

    modalBackground: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      padding: 20,
      backgroundColor:
        "rgba(0, 0, 0, 0.65)",
    },

    modal: {
      width: "100%",
      maxWidth: 430,
      padding: 24,
      borderRadius: 24,
      backgroundColor:
        "#3030a1ff",
      borderWidth: 2,
      borderColor:
        "#b7bccbff",
    },

    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 24,
      fontWeight: "600",
      color: "#ffffff",
    },

    closeButton: {
      fontSize: 32,
      lineHeight: 32,
      color: "#ffffff",
    },

    // ------------------------------------
    // INPUTS
    // ------------------------------------

    inputLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: "#ffffff",
      marginBottom: 7,
    },

    input: {
      width: "100%",
      height: 50,
      paddingHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#888888",
      backgroundColor:
        "#4d49a7ff",
      color: "#ffffff",
      fontSize: 14,
    },

    contentInput: {
      height: 110,
      paddingTop: 14,
    },

    // ------------------------------------
    // ÁREAS DO MODAL
    // ------------------------------------

    modalAreas: {
      paddingBottom: 5,
    },

    modalArea: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 18,
      backgroundColor:
        "#d7dcf2",
    },

    modalAreaSelected: {
      backgroundColor:
        "#0037ffff",
    },

    modalAreaText: {
      fontSize: 12,
      fontWeight: "500",
      color: "#323232",
    },

    modalAreaTextSelected: {
      color: "#ffffff",
      fontWeight: "600",
    },

    // ------------------------------------
    // BOTÃO CRIAR
    // ------------------------------------

    createButton: {
      width: "100%",
      height: 52,
      marginTop: 20,
      borderRadius: 26,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#0037ffff",
    },

    createButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#ffffff",
    },

    loadingButtonText: {
      marginLeft: 10,
      fontSize: 14,
      fontWeight: "600",
      color: "#ffffff",
    },

    disabledButton: {
      opacity: 0.6,
    },

    // ------------------------------------
    // CANCELAR
    // ------------------------------------

    cancelButton: {
      alignItems: "center",
      marginTop: 16,
    },

    cancelButtonText: {
      fontSize: 14,
      color: "#eeeeee",
    },

    // ------------------------------------
    // ESTADOS
    // ------------------------------------

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      padding: 20,
    },

    loadingText: {
      marginTop: 10,
      fontSize: 14,
      color: "#ffffff",
    },

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
      backgroundColor:
        "#ffeeeeff",
    },

    retryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#323232ff",
    },

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