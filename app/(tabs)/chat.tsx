import { useState, useContext, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
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

// Voice Assistant Bubble Component
const VoiceAssistantBubble = ({ isActive, isListening }: { isActive: boolean, isListening: boolean }) => {
  // Create animated values for the wave animations
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const wave3Anim = useRef(new Animated.Value(0)).current;
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Colors
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  
  useEffect(() => {
    if (isActive) {
      // Start pulse animation for the bubble when active
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();

      // Start wave animations only if in listening/speaking mode
      if (isListening) {
        // Animate wave 1
        Animated.loop(
          Animated.sequence([
            Animated.timing(wave1Anim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(wave1Anim, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true,
            })
          ])
        ).start();
        
        // Animate wave 2 with delay
        Animated.loop(
          Animated.sequence([
            Animated.timing(wave2Anim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(wave2Anim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            })
          ])
        ).start();
        
        // Animate wave 3 with more delay
        Animated.loop(
          Animated.sequence([
            Animated.timing(wave3Anim, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(wave3Anim, {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            })
          ])
        ).start();
      }
    } else {
      // Stop all animations if not active
      pulseAnim.setValue(1);
      wave1Anim.setValue(0);
      wave2Anim.setValue(0);
      wave3Anim.setValue(0);
    }
    
    return () => {
      // Clean up animations when component unmounts
      pulseAnim.stopAnimation();
      wave1Anim.stopAnimation();
      wave2Anim.stopAnimation();
      wave3Anim.stopAnimation();
    };
  }, [isActive, isListening]);

  if (!isActive) return null;

  // Get theme context to adapt colors
  const themeContext = useContext(ThemeContext);
  const effectiveTheme = themeContext?.effectiveTheme || 'light';
  const isDarkMode = effectiveTheme === 'dark';

  // Adjust wave opacity and color for dark mode
  const waveOpacity = isDarkMode ? 0.3 : 0.5;
  const waveColor = isDarkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(255, 255, 255, 0.5)';

  return (
    <View style={styles.voiceAssistantContainer}>
      <Animated.View 
        style={[
          styles.voiceBubble,
          { backgroundColor: tintColor, transform: [{ scale: pulseAnim }] }
        ]}
      >
        <FontAwesome name="microphone" size={22} color={isDarkMode ? "#333" : "#fff"} />
        
        {isListening && (
          <View style={styles.waveContainer}>
            <Animated.View 
              style={[
                styles.wave, 
                { 
                  opacity: wave1Anim, 
                  transform: [{ scaleY: wave1Anim }],
                  backgroundColor: waveColor
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.wave, 
                { 
                  opacity: wave2Anim, 
                  transform: [{ scaleY: wave2Anim }],
                  backgroundColor: waveColor
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.wave, 
                { 
                  opacity: wave3Anim, 
                  transform: [{ scaleY: wave3Anim }],
                  backgroundColor: waveColor
                }
              ]} 
            />
          </View>
        )}
      </Animated.View>
      
      <ThemedText style={styles.voiceAssistantText}>
        {isListening ? 'Listening...' : 'Voice Assistant'}
      </ThemedText>
    </View>
  );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
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

  const toggleVoiceMode = () => {
    const newState = !voiceModeActive;
    setVoiceModeActive(newState);
    
    // If turning on voice mode, simulate listening state
    if (newState) {
      simulateListeningAndResponse();
    } else {
      setIsListening(false);
    }
  };

  const simulateListeningAndResponse = () => {
    // Simulate the listening state for 3 seconds
    setIsListening(true);
    
    setTimeout(() => {
      // Stop listening and send a simulated voice response
      setIsListening(false);
      
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          text: "This is a simulated voice response. I'm your voice assistant!",
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 500);
    }, 3000);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Voice Assistant Bubble */}
      <VoiceAssistantBubble isActive={voiceModeActive} isListening={isListening} />
      
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
      
      {/* Voice button positioned outside and above the input container */}
      <View style={styles.voiceButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.voiceModeButton,
            { backgroundColor: voiceModeActive ? '#ff4c4c' : tintColor }
          ]}
          onPress={toggleVoiceMode}
        >
          <FontAwesome 
            name={voiceModeActive ? "microphone-slash" : "microphone"} 
            size={18} 
            color={effectiveTheme === 'dark' ? "#333" : "#fff"} 
          />
        </TouchableOpacity>
      </View>
      
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
  },
  voiceModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor handled dynamically
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 70, // Position it above the input container
    right: 20, // Align it with the send button
    zIndex: 1, // Ensure it stays above other elements
  },
  voiceAssistantContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  voiceAssistantText: {
    marginTop: 10,
    fontSize: 16,
  },
});
