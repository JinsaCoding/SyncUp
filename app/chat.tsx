import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GlobalStyles, GlobalThemes } from "./styles";

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
};

const QUICK_REPLIES = [
  "On my way 🚗",
  "Running late ⏰",
  "Can't make it ❌",
  "See you there! 👋",
  "What time? 🕐",
  "Sounds good 👍",
];

const BOT_REPLIES: Record<string, string> = {
  "On my way 🚗": "Great, see you soon!",
  "Running late ⏰": "No worries, take your time.",
  "Can't make it ❌": "Aw that's a shame, next time!",
  "See you there! 👋": "Can't wait! 🙌",
  "What time? 🕐": "We said 7pm!",
  "Sounds good 👍": "Perfect 🎉",
};

export default function ChatScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const colors = GlobalThemes["dark"];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: `This is the start of your chat with ${name}.`,
      sender: "them",
      timestamp: new Date(),
    },
  ]);

  const sendMessage = (text: string) => {
    const myMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, myMsg]);

    // Simulate a reply after a short delay
    setTimeout(() => {
      const reply = BOT_REPLIES[text] ?? "👀";
      const theirMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "them",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, theirMsg]);
    }, 800);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <SafeAreaView
      style={[
        GlobalStyles.chatContainer,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View
        style={[GlobalStyles.chatHeader, { borderBottomColor: colors.border }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={GlobalStyles.chatBackBtn}
        >
          <Text style={[GlobalStyles.chatBackText, { color: colors.text }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[GlobalStyles.chatHeaderTitle, { color: colors.text }]}>
          Chat
        </Text>
        <View style={GlobalStyles.chatBackBtn} />
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={GlobalStyles.chatMessageList}
        renderItem={({ item }) => (
          <View
            style={[
              GlobalStyles.chatBubble,
              item.sender === "me"
                ? GlobalStyles.chatBubbleMe
                : GlobalStyles.chatBubbleThem,
              {
                backgroundColor:
                  item.sender === "me" ? colors.accent : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[GlobalStyles.chatBubbleText, { color: colors.text }]}>
              {item.text}
            </Text>
            <Text style={[GlobalStyles.chatTimestamp, { color: colors.text }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        )}
      />

      {/* Quick replies */}
      <View
        style={[
          GlobalStyles.chatQuickReplyWrapper,
          { borderTopColor: colors.border },
        ]}
      >
        <Text
          style={[GlobalStyles.chatQuickReplyLabel, { color: colors.text }]}
        >
          Quick replies
        </Text>
        <View style={GlobalStyles.chatQuickReplyRow}>
          {QUICK_REPLIES.map((reply) => (
            <Pressable
              key={reply}
              onPress={() => sendMessage(reply)}
              style={[
                GlobalStyles.chatQuickReplyBtn,
                { borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  GlobalStyles.chatQuickReplyText,
                  { color: colors.text },
                ]}
              >
                {reply}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
