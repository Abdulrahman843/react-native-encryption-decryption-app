import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform } from "react-native";
import { Buffer } from "buffer";

// Cross-platform XOR encryption function
const encrypt = (inputText: string, secretKey: string): string => {
  if (!inputText || !secretKey) {
    return "Error: Please enter text and a key.";
  }

  console.log("🔒 Encrypting Text:", inputText);
  console.log("🔑 Using Key:", secretKey);

  let result = "";
  for (let i = 0; i < inputText.length; i++) {
    result += String.fromCharCode(
      inputText.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
    );
  }

  // Use `Buffer` for React Native (mobile) & `TextEncoder` for Web
  if (Platform.OS === "web") {
    const encoded = new TextEncoder().encode(result);
    return btoa(String.fromCharCode(...encoded));
  } else {
    return Buffer.from(result).toString("base64");
  }
};

// Cross-platform XOR decryption function
const decrypt = (inputText: string, secretKey: string): string => {
  if (!inputText || !secretKey) {
    return "Error: Please enter encrypted text and a key.";
  }

  console.log("🔓 Decrypting Text:", inputText);
  console.log("🔑 Using Key:", secretKey);

  try {
    let decodedText = "";

    // Use `Buffer` for React Native (mobile) & `TextDecoder` for Web
    if (Platform.OS === "web") {
      let decodedBytes = Uint8Array.from(atob(inputText), (c) =>
        c.charCodeAt(0)
      );
      decodedText = new TextDecoder().decode(decodedBytes);
    } else {
      decodedText = Buffer.from(inputText, "base64").toString("binary");
    }

    let result = "";
    for (let i = 0; i < decodedText.length; i++) {
      result += String.fromCharCode(
        decodedText.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
      );
    }

    console.log("✅ Decrypted Output:", result);
    return result;
  } catch (error) {
    console.log("❌ Decryption Error:", error);
    return "Error: Decryption failed. Check the key.";
  }
};

export default function TabScreen() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Encrypt & Decrypt (Mobile & Web)</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter secret key"
        value={key}
        onChangeText={setKey}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Encrypt"
          onPress={() => {
            let encrypted = encrypt(text, key);
            console.log("🚀 Updating encryptedText state:", encrypted);
            setEncryptedText(encrypted);
          }}
          color="blue"
        />

        <Button
          title="Decrypt"
          onPress={() => {
            let decrypted = decrypt(encryptedText, key);
            console.log("🚀 Updating decryptedText state:", decrypted);
            setDecryptedText(decrypted);
          }}
          color="green"
        />
      </View>

      {encryptedText && (
        <Text style={styles.result}>🔐 Encrypted: {encryptedText}</Text>
      )}

      {decryptedText && (
        <Text style={styles.result}>🔓 Decrypted: {decryptedText}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  result: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    width: "100%",
  },
});