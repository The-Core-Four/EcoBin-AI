import React, { useState } from "react";
import { 
  View, TextInput, TouchableOpacity, Text, ScrollView, StyleSheet, 
  ActivityIndicator, Image, KeyboardAvoidingView, Platform 
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI SDK
const API_KEY = "AIzaSyBf7I5bOeT6Tk4I8OsGQhOUgQcVmdgzxRc";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are EcoBin Ai, a friendly assistant who helps with garbage collection, disposal, and recycling tips. Respond only to relevant queries and in Sinhala if asked.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMessageSend = async () => {
    if (userInput.trim() === "") return;

    setMessages((prevMessages) => [...prevMessages, { text: userInput, role: "user" }]);
    setLoading(true);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [...messages, { text: userInput, role: "user" }].map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
      });

      const response = await chatSession.sendMessage(userInput);
      const botResponse = response.response.text();

      setMessages((prevMessages) => [...prevMessages, { text: botResponse, role: "model" }]);
    } catch (error) {
      console.error("Error during chat:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Something went wrong. Please try again.", role: "model" },
      ]);
    } finally {
      setLoading(false);
    }

    setUserInput("");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>EcoBin Ai Chatbot</Text>
        </View>

        {/* Hide chatbot image when chat has messages */}
        {messages.length === 0 && (
          <View style={styles.imageContainer}>
            <Image source={require("../../assets/chatbot.png")} style={styles.chatbotImage} />
          </View>
        )}

        <ScrollView 
          style={styles.chatContainer} 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => (
            <View key={index} style={message.role === "user" ? styles.userMessage : styles.botMessage}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
          {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.spinner} />}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend}>
            <Image source={require("../../assets/Vector.png")} style={styles.sendButtonImage} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f1",
  },
  headerContainer: {
    backgroundColor: "#4CAF50",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 50,
  },
  chatbotImage: {
    width: 300,
    height: 250,
    resizeMode: "contain",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f0f4f1",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 3,
  },
  sendButtonImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: "80%",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  spinner: {
    marginTop: 10,
  },
});
