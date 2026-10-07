import { LinearGradient } from "expo-linear-gradient";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { useEffect, useState } from "react";

import { getAllQuestions } from "../services/questionService";
import { getCurrentUserId } from "../services/sessionService";
import { Question, Area } from "../services/types";

const AREAS: ("Todas" | Area)[] = [
    "Todas",
    "Voz",
    "Linguagem",
    "Fala",
    "Fluencia",
];

export default function Questions() {
    // ========================================
    // UTILIZADOR ATUAL
    // ========================================

    const [userId, setUserId] =
        useState<string | null>(null);

    const [loadingUser, setLoadingUser] =
        useState(true);

    // ========================================
    // QUESTÕES
    // ========================================

    const [questions, setQuestions] =
        useState<Question[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    // ========================================
    // FILTRO DE ÁREA
    // ========================================

    const [selectedArea, setSelectedArea] =
        useState<"Todas" | Area>("Todas");

    // ========================================
    // LIKES LOCAIS
    // ========================================

    const [likedQuestions, setLikedQuestions] =
        useState<Record<string, boolean>>({});

    // ========================================
    // CARREGAR QUESTÕES
    // ========================================

    const loadQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const data =
                await getAllQuestions();

            console.log(
                "Questões carregadas:",
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

    // ========================================
    // CARREGAR UTILIZADOR E QUESTÕES
    // ========================================

    useEffect(() => {
        const initialize = async () => {
            // --------------------------------
            // UTILIZADOR
            // --------------------------------

            try {
                const currentUserId =
                    await getCurrentUserId();

                console.log(
                    "Sessão atual:",
                    currentUserId
                );

                setUserId(
                    currentUserId ?? null
                );
            } catch (error) {
                console.error(
                    "Erro ao carregar sessão:",
                    error
                );
            } finally {
                setLoadingUser(false);
            }

            // --------------------------------
            // QUESTÕES
            // --------------------------------

            await loadQuestions();
        };

        initialize();
    }, []);

    // ========================================
    // LIKE
    // ========================================

    const toggleLike = (
        questionId: string
    ) => {
        setLikedQuestions((current) => ({
            ...current,
            [questionId]:
                !current[questionId],
        }));
    };

    // ========================================
    // FILTRAGEM
    // ========================================

    const filteredQuestions =
        questions.filter((question) => {
            // --------------------------------
            // VERIFICAR UTILIZADOR
            // --------------------------------

            if (!userId) {
                return false;
            }

            // --------------------------------
            // APENAS QUESTÕES DO UTILIZADOR
            // --------------------------------

            if (
                question.authorId !== userId
            ) {
                return false;
            }

            // --------------------------------
            // FILTRO DE ÁREA
            // --------------------------------

            if (
                selectedArea !== "Todas" &&
                question.area !== selectedArea
            ) {
                return false;
            }

            return true;
        });

    // ========================================
    // FORMATAR DATA
    // ========================================

    const formatDate = (
        date: string
    ) => {
        const dateObject =
            new Date(date);

        return dateObject.toLocaleDateString(
            "pt-PT",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    // ========================================
    // RENDER
    // ========================================

    return (
        <LinearGradient
            colors={[
                "#bbc4e6ff",
                "#181698ff",
            ]}
            start={{
                x: 0,
                y: 0,
            }}
            end={{
                x: 0,
                y: 1,
            }}
            style={styles.container}
        >
            <View style={styles.content}>

                {/* ================================= */}
                {/* TÍTULO */}
                {/* ================================= */}

                <Text
                    style={
                        styles.pageTitle
                    }
                >
                    Minhas Questões
                </Text>

                {/* ================================= */}
                {/* FILTRO DE ÁREA */}
                {/* ================================= */}

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
                            selectedArea ===
                            item;

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

                {/* ================================= */}
                {/* LOADING */}
                {/* ================================= */}

                {loading ||
                    loadingUser ? (
                    <View
                        style={
                            styles.center
                        }
                    >
                        <ActivityIndicator
                            size="large"
                            color="#ffffff"
                        />

                        <Text
                            style={
                                styles.loadingText
                            }
                        >
                            A carregar questões...
                        </Text>
                    </View>

                ) : error ? (

                    /* ================================= */
                    /* ERRO */
                    /* ================================= */

                    <View
                        style={
                            styles.center
                        }
                    >
                        <Text
                            style={
                                styles.errorText
                            }
                        >
                            {error}
                        </Text>
                    </View>

                ) : !userId ? (

                    /* ================================= */
                    /* SEM SESSÃO */
                    /* ================================= */

                    <View
                        style={
                            styles.center
                        }
                    >
                        <Text
                            style={
                                styles.errorText
                            }
                        >
                            Não foi possível
                            identificar o
                            utilizador atual.
                        </Text>
                    </View>

                ) : (

                    /* ================================= */
                    /* LISTA DE QUESTÕES */
                    /* ================================= */

                    <FlatList
                        data={
                            filteredQuestions
                        }
                        keyExtractor={(
                            item
                        ) => item.id}
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.list
                        }

                        renderItem={({
                            item,
                        }) => {

                            // ========================================
                            // PRIMEIRA RESPOSTA
                            // ========================================

                            const answer =
                                item.answers?.[0] ??
                                null;

                            // ========================================
                            // LIKES DAS RESPOSTAS
                            // ========================================
                            //
                            // Soma os likes de todas as respostas.
                            //
                            // Se não existirem respostas:
                            //
                            // backendLikes = 0
                            //
                            // ========================================

                            const backendLikes =
                                item.answers?.reduce(
                                    (
                                        total,
                                        answer
                                    ) =>
                                        total +
                                        (
                                            answer.likesCount ??
                                            0
                                        ),
                                    0
                                ) ?? 0;

                            // ========================================
                            // VERIFICAR LIKE LOCAL
                            // ========================================

                            const isLiked =
                                likedQuestions[
                                item.id
                                ] ?? false;

                            // ========================================
                            // TOTAL DE LIKES
                            // ========================================
                            //
                            // Exemplo:
                            //
                            // Backend = 5
                            // Sem like local = 5
                            //
                            // Backend = 5
                            // Com like local = 6
                            //
                            // ========================================

                            const totalLikes =
                                backendLikes +
                                (
                                    isLiked
                                        ? 1
                                        : 0
                                );

                            return (
                                <View
                                    style={
                                        styles.questionContainer
                                    }
                                >

                                    {/* ================================= */}
                                    {/* QUESTÃO */}
                                    {/* ================================= */}

                                    <View
                                        style={
                                            styles.questionBox
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.questionTitle
                                            }
                                        >
                                            Questão
                                        </Text>

                                        <Text
                                            style={
                                                styles.date
                                            }
                                        >
                                            {formatDate(
                                                item.createdAt
                                            )}
                                        </Text>

                                        <Text
                                            style={
                                                styles.question
                                            }
                                        >
                                            {item.title}
                                        </Text>

                                        <Text
                                            style={
                                                styles.questionContent
                                            }
                                        >
                                            {item.content}
                                        </Text>

                                        <Text
                                            style={
                                                styles.author
                                            }
                                        >
                                            Por:{" "}
                                            {
                                                item.authorName
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.area
                                            }
                                        >
                                            Área:{" "}
                                            {
                                                item.area
                                            }
                                        </Text>
                                    </View>

                                    {/* ================================= */}
                                    {/* RESPOSTA */}
                                    {/* ================================= */}

                                    <View
                                        style={
                                            styles.answerBox
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.answerTitle
                                            }
                                        >
                                            Resposta
                                        </Text>

                                        {/* ================================= */}
                                        {/* DATA DA RESPOSTA */}
                                        {/* ================================= */}

                                        {answer && (
                                            <Text
                                                style={
                                                    styles.date
                                                }
                                            >
                                                {formatDate(
                                                    answer.createdAt
                                                )}
                                            </Text>
                                        )}

                                        {/* ================================= */}
                                        {/* CONTEÚDO DA RESPOSTA */}
                                        {/* ================================= */}

                                        <Text
                                            style={[
                                                styles.answer,
                                                !answer &&
                                                styles.noAnswer,
                                            ]}
                                        >
                                            {answer
                                                ? answer.content
                                                : "Sem resposta"}
                                        </Text>

                                        {/* ================================= */}
                                        {/* AUTOR DA RESPOSTA */}
                                        {/* ================================= */}

                                        {answer && (
                                            <Text
                                                style={
                                                    styles.author
                                                }
                                            >
                                                Por:{" "}
                                                {
                                                    answer.authorName
                                                }
                                            </Text>
                                        )}

                                        {/* ================================= */}
                                        {/* LIKES */}
                                        {/* ================================= */}
                                        <View
                                            style={
                                                styles.likeRow
                                            }
                                        >
                                            <Pressable
                                                style={
                                                    styles.likeButton
                                                }
                                                onPress={() =>
                                                    toggleLike(
                                                        item.id
                                                    )
                                                }
                                            >

                                                {/* CORAÇÃO */}

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

                                                {/* NÚMERO DE LIKES */}

                                                <Text
                                                    style={
                                                        styles.likesCount
                                                    }
                                                >
                                                    {
                                                        totalLikes
                                                    }
                                                </Text>

                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            );
                        }}

                        /* ================================= */
                        /* LISTA VAZIA */
                        /* ================================= */

                        ListEmptyComponent={
                            <View
                                style={
                                    styles.center
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyText
                                    }
                                >
                                    {selectedArea !==
                                        "Todas"
                                        ? "Nenhuma questão encontrada nesta área."
                                        : "Não existem questões."}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </LinearGradient>
    );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

    // ====================================
    // CONTAINER
    // ====================================

    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        padding: 24,
    },

    // ====================================
    // TÍTULO
    // ====================================

    pageTitle: {
        marginTop: 30,
        marginBottom: 25,

        fontSize: 30,
        fontWeight: "600",

        color: "#ffffffff",
    },

    // ====================================
    // LISTA
    // ====================================

    list: {
        paddingTop: 0,
        paddingBottom: 120,
    },

    // ====================================
    // CARD DA QUESTÃO
    // ====================================

    questionContainer: {
        width: "100%",
        marginBottom: 20,

        padding: 20,

        borderRadius: 20,

        backgroundColor: "#2738a4ff",
        borderColor: "#888888",
        borderWidth: 3,
    },

    // ====================================
    // CAIXA DA QUESTÃO
    // ====================================

    questionBox: {
        width: "100%",

        paddingHorizontal: 14,
        paddingVertical: 12,

        borderWidth: 1,
        borderColor: "#414141ff",
        borderRadius: 12,
    },

    questionTitle: {
        fontSize: 17,
        fontWeight: "600",

        color: "#ffffffff",

        marginBottom: 5,
    },

    date: {
        fontSize: 11,
        color: "#888888",

        marginBottom: 8,
    },

    question: {
        fontSize: 17,
        fontWeight: "600",
        lineHeight: 23,

        color: "#ffffffff",

        marginBottom: 8,
    },

    questionContent: {
        fontSize: 14,
        lineHeight: 21,

        color: "#cccccc",
    },

    author: {
        marginTop: 10,

        fontSize: 12,
        color: "#aaaaaa",
    },

    area: {
        marginTop: 5,

        fontSize: 12,
        color: "#aaaaaa",
    },

    // ====================================
    // CAIXA DA RESPOSTA
    // ====================================

    answerBox: {
        width: "100%",

        marginTop: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,

        borderWidth: 1,
        borderColor: "#414141ff",
        borderRadius: 12,
    },

    answerTitle: {
        fontSize: 17,
        fontWeight: "600",

        color: "#ffffffff",

        marginBottom: 5,
    },

    answer: {
        fontSize: 14,
        lineHeight: 21,

        color: "#cccccc",
    },

    noAnswer: {
        color: "#888888",
        fontStyle: "italic",
    },

    // ====================================
    // LIKES
    // ====================================

    likeRow: {
        flexDirection: "row",

        justifyContent: "flex-end",

        alignItems: "center",

        marginTop: 15,
    },

    likeButton: {
        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    heart: {
        fontSize: 25,

        color: "#aaaaaa",

        marginRight: 6,
    },

    heartLiked: {
        fontSize: 25,
    },

    likesCount: {
        fontSize: 15,

        fontWeight: "600",

        color: "#ffffff",
    },

    // ====================================
    // ESTADO CENTRAL
    // ====================================

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

    errorText: {
        fontSize: 15,

        color: "#ffcccc",

        textAlign: "center",
    },

    emptyText: {
        fontSize: 15,

        color: "#ffffff",

        textAlign: "center",
    },

    // ====================================
    // FILTROS DE ÁREA
    // ====================================

    areaFilters: {
        paddingTop: 10,

        paddingBottom: 10,
    },

    areaFilter: {
        width: 70,

        height: 40,

        alignItems: "center",

        justifyContent: "center",

        marginRight: 8,

        borderRadius: 18,

        backgroundColor: "#d7dcf2",
    },

    areaFilterSelected: {
        backgroundColor: "#2738a4ff",
    },

    areaFilterText: {
        fontSize: 12,

        fontWeight: "500",

        color: "#323232",

        textAlign: "center",
    },

    areaFilterTextSelected: {
        color: "#ffffff",

        fontWeight: "600",
    },
});