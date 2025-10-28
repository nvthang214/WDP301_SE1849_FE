import { OpenAIOutlined, PlusSquareOutlined, RobotOutlined, SendOutlined } from "@ant-design/icons";
import { Button, FloatButton, Input, Popover, Spin, Tag, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { AIService } from "../../../services/AIService";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import TypewriterMarkdown from "./components/TypeWriterMarkdown";

const AIFloatButton = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "welcome",
      role: "assistant",
      content: "Xin chào! Mình là trợ lý AI, bạn cần hỗ trợ gì hôm nay?",
    },
  ]);

  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const pendingReplyTimeoutRef = useRef(null);
  const messageListRef = useRef(null);

  // 🚀 Hàm gửi message tới backend
  const handleSendMessage = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isSending) return;

    setIsSending(true);

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedPrompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      // 👉 Gọi API backend
      const res = await AIService.candidateQueryAI({
        question: trimmedPrompt,
        topK: 5,
        conversation_id: conversationId,
      });
      console.log(res);

      //  Lưu conversation_id để chat tiếp
      if (!conversationId && res.conversation_id) {
        setConversationId(res.conversation_id);
      }
      const aiMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: res.answer || "AI không có phản hồi.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: <span class="text-red-500">Đã xảy ra lỗi khi gọi AI.</span>,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [prompt, isSending, conversationId]);

  // ⌨️ Gửi khi nhấn Enter
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  //  Reset cuộc trò chuyện
  const handleResetChat = useCallback(() => {
    if (pendingReplyTimeoutRef.current) {
      clearTimeout(pendingReplyTimeoutRef.current);
      pendingReplyTimeoutRef.current = null;
    }
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Xin chào! Mình là trợ lý AI, bạn cần hỗ trợ gì hôm nay?",
      },
    ]);
    setPrompt("");
    setIsSending(false);
    setConversationId(null);
  }, []);

  //  Auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (!chatOpen) return;
    const container = messageListRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    });
  }, [messages, chatOpen, isSending]);

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (pendingReplyTimeoutRef.current) {
        clearTimeout(pendingReplyTimeoutRef.current);
      }
    };
  }, []);

  //  UI chat popup
  const chatContent = (
    <div className="flex h-[500px] w-[500px] flex-col">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RobotOutlined />
          <Typography.Text strong>AI Assistant</Typography.Text>
          <Tag color="blue" size="small">
            Beta
          </Tag>
        </div>
        <Popover content="Chat mới" placement="top" trigger="hover">
          <Button
            type="text"
            size="small"
            icon={<PlusSquareOutlined />}
            onClick={handleResetChat}
            className="flex items-center"
          />
        </Popover>
      </div>

      {/* Chat list */}
      <div ref={messageListRef} className="scrollbar-thin mb-3 flex-1 overflow-y-auto pr-1">
        {messages.map((message) => {
          const isUser = message.role === "user";
          const align = isUser ? "justify-end" : "justify-start";
          const bubble =
            "max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed shadow-sm " +
            (isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm");

          return (
            <div key={message.id} className={`mb-2 flex ${align}`}>
              <div className={bubble}>
                {message.role === "assistant" ? (
                  <TypewriterMarkdown content={message.content} speed={15} />
                ) : (
                  message.content
                )}
              </div>
            </div>
          );
        })}
        {isSending && (
          <div className="mb-2 ml-2 flex justify-start">
            <Spin size="small" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2">
        <Input.TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder="Nhập câu hỏi của bạn..."
          className="resize-none"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={!prompt.trim() || isSending}
        />
      </div>
    </div>
  );

  // 🧠 FloatButton chính
  return (
    <Popover
      content={chatContent}
      placement="leftTop"
      trigger="click"
      open={chatOpen}
      onOpenChange={setChatOpen}
      arrow={false}
    >
      <FloatButton
        type="primary"
        className="animate-bounce"
        icon={<OpenAIOutlined />}
        style={{ bottom: 60 }}
      />
    </Popover>
  );
};

export default AIFloatButton;
