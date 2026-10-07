import { LinearGradient } from "expo-linear-gradient";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";

import { getAllQuestions } from "../services/questionService";
import { Question } from "../services/types";

export default function Questions() {
    const [questions, setQuestions] = useState<Question[]>([]);
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

    const formatDate = (date: string) => {
        const dateObject = new Date(date);

        return dateObject.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <LinearGradient
            colors={["#bbc4e6ff", "#181698ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>

                {/* Título */}
                <Text style={styles.pageTitle}>
                    Minhas Questões
                </Text>

                {/* Loading */}
                {loading && (
                    <View style={styles.center}>
                        <ActivityIndicator
                            size="large"
                            color="#ffffff"
                        />

                        <Text style={styles.loadingText}>
                            A carregar questões...
                        </Text>
                    </View>
                )}

                {/* Erro */}
                {!loading && error && (
                    <View style={styles.center}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                )}

                {/* Lista */}
                {!loading && !error && (
                    <FlatList
                        data={questions}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => {

                            // A API devolve um array de respostas.
                            // Para manter o design atual,
                            // mostramos a primeira resposta.
                            const answer = item.answers?.[0] ?? null;

                            return (
                                <View style={styles.questionContainer}>

                                    {/* Questão */}
                                    <View style={styles.questionBox}>

                                        <Text style={styles.questionTitle}>
                                            Questão
                                        </Text>

                                        <Text style={styles.date}>
                                            {formatDate(item.createdAt)}
                                        </Text>

                                        <Text style={styles.question}>
                                            {item.title}
                                        </Text>

                                        <Text style={styles.questionContent}>
                                            {item.content}
                                        </Text>

                                        <Text style={styles.author}>
                                            Por: {item.authorName}
                                        </Text>

                                        <Text style={styles.area}>
                                            Área: {item.area}
                                        </Text>

                                    </View>

                                    {/* Resposta */}
                                    <View style={styles.answerBox}>

                                        <Text style={styles.answerTitle}>
                                            Resposta
                                        </Text>

                                        {answer && (
                                            <Text style={styles.date}>
                                                {formatDate(answer.createdAt)}
                                            </Text>
                                        )}

                                        <Text
                                            style={[
                                                styles.answer,
                                                !answer && styles.noAnswer,
                                            ]}
                                        >
                                            {answer
                                                ? answer.content
                                                : "Sem resposta"}
                                        </Text>

                                        {answer && (
                                            <Text style={styles.author}>
                                                Por: {answer.authorName}
                                            </Text>
                                        )}

                                    </View>

                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <Text style={styles.emptyText}>
                                    Não existem questões.
                                </Text>
                            </View>
                        }
                    />
                )}

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        padding: 24,
    },

    pageTitle: {
        marginTop: 30,
        marginBottom: 25,

        fontSize: 30,
        fontWeight: "600",

        color: "#ffffffff",
    },

    list: {
        paddingBottom: 120,
    },

    questionContainer: {
        width: "100%",
        marginBottom: 20,

        padding: 20,

        borderRadius: 20,

        backgroundColor: "#2738a4ff",

        borderColor: "#888888",
        borderWidth: 3,
    },

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
});