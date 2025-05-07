import { useState, useContext } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const themeContext = useContext(ThemeContext);
  const effectiveTheme = themeContext?.effectiveTheme || 'light';
  
  // Get themed colors using the useThemeColor hook
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#ccc', dark: '#555' }, 'border');

  const handleSend = () => {
    if (inputText.trim().length === 0) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');

    // Simulate a bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Echo: ${newMessage.text}`,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map(msg => (
          <ThemedView
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' 
                ? [styles.userMessage, { backgroundColor: tintColor }] 
                : [styles.botMessage, { 
                    backgroundColor: effectiveTheme === 'dark' ? '#444' : '#E5E5EA',
                    borderColor: borderColor,
                    borderWidth: effectiveTheme === 'dark' ? 1 : 0
                  }],
            ]}
          >
            <ThemedText 
              style={{ 
                color: msg.sender === 'user' ? '#fff' : textColor 
              }}
            >
              {msg.text}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>
      <View style={[styles.inputContainer, { borderColor: borderColor }]}>
        <TextInput
          style={[
            styles.input, 
            { 
              color: textColor,
              backgroundColor: effectiveTheme === 'dark' ? '#333' : '#fff',
              borderColor: borderColor,
            }
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={effectiveTheme === 'dark' ? '#999' : '#777'}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            { backgroundColor: tintColor }
          ]} 
          onPress={handleSend}
        >
          <FontAwesome 
            name="send" 
            size={18} 
            color={effectiveTheme === 'dark' ? '#000' : '#fff'} 
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    // backgroundColor handled dynamically
  },
  botMessage: {
    alignSelf: 'flex-start',
    // backgroundColor handled dynamically
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    // borderColor handled dynamically
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    // color, backgroundColor, and borderColor handled dynamically
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor handled dynamically
  }
});
