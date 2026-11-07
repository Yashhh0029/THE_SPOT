/**
 * The Spot - Interactive Chat Conversation Screen
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { Conversation } from '../../types/chat';
import { Avatar } from '../../components/common/Avatar';
import { Icon } from '../../components/common/Icon';

interface ChatDetailScreenProps {
  conversation: Conversation;
  onBack: () => void;
}

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  conversation,
  onBack,
}) => {
  const { sendMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<any>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');
    sendMessage(conversation.id, textToSend);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd?.({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <Avatar
          uri={conversation.avatar}
          name={conversation.title}
          size={38}
          isOnline={conversation.isOnline}
        />

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {conversation.title}
          </Text>
          <Text style={styles.headerStatus}>
            {conversation.type === 'squad'
              ? 'Squad Channel'
              : conversation.type === 'event'
              ? 'Event Channel'
              : conversation.isOnline
              ? 'Online'
              : 'Direct Message'}
          </Text>
        </View>

        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="info" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Message History */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {/* Security & Welcome Notice */}
          <View style={styles.securityNotice}>
            <Icon name="shield-check" size={14} color={colors.secondary} />
            <Text style={styles.securityText}>
              End-to-end coordinated on The Spot. Treat squad mates and party attendees with respect.
            </Text>
          </View>

          {conversation.messages.length === 0 ? (
            <View style={styles.emptyChatBox}>
              <Icon name="message-square" size={28} color={colors.textMuted} />
              <Text style={styles.emptyChatTitle}>No messages yet</Text>
              <Text style={styles.emptyChatSub}>
                Send a message to coordinate with {conversation.title}.
              </Text>
            </View>
          ) : (
            conversation.messages.map(msg => {
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    msg.isMe ? styles.messageRowMe : styles.messageRowOther,
                  ]}
                >
                  {!msg.isMe && (
                    <Avatar uri={msg.senderAvatar} name={msg.senderName} size={28} style={styles.msgAvatar} />
                  )}

                  <View
                    style={[
                      styles.bubble,
                      msg.isMe ? styles.bubbleMe : styles.bubbleOther,
                    ]}
                  >
                    {!msg.isMe && (
                      <Text style={styles.senderLabel}>{msg.senderName}</Text>
                    )}
                    <Text style={[styles.bubbleText, msg.isMe && styles.bubbleTextMe]}>
                      {msg.text}
                    </Text>
                    <View style={styles.bubbleFooter}>
                      <Text style={[styles.timeLabel, msg.isMe && styles.timeLabelMe]}>
                        {msg.timestamp}
                      </Text>
                      {msg.isMe && (
                        <Text
                          style={[
                            styles.statusCheck,
                            msg.status === 'read' ? styles.statusCheckRead : styles.statusCheckSent,
                          ]}
                        >
                          {msg.status === 'read' || msg.status === 'delivered' ? ' ✓✓' : ' ✓'}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Bottom Input Field */}
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message ${conversation.title.split(' ')[0]}...`}
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={[
              styles.sendBtn,
              inputText.trim() ? styles.sendBtnActive : styles.sendBtnInactive,
            ]}
          >
            <Icon
              name="send"
              size={16}
              color={inputText.trim() ? colors.textPrimary : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  headerStatus: {
    fontSize: typography.fontSize.xxs,
    color: colors.secondary,
    marginTop: 1,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.base,
  },
  securityText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: spacing.xs + 2,
    flex: 1,
    lineHeight: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    marginRight: 6,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.lg,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderBottomLeftRadius: 4,
  },
  senderLabel: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: colors.textPrimary,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
  },
  timeLabelMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusCheck: {
    fontSize: 10,
    marginLeft: 3,
  },
  statusCheckRead: {
    color: colors.secondary,
  },
  statusCheckSent: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyChatBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyChatTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  emptyChatSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    maxHeight: 90,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendBtnActive: {
    backgroundColor: colors.primary,
  },
  sendBtnInactive: {
    backgroundColor: colors.backgroundSurface3,
  },
});
