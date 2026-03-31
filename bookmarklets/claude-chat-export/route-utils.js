'use strict';

function getClaudeConversationId(pathname) {
  const match = pathname.match(/(?:^|\/)(?:organization\/[^/]+\/)?chat\/([^/]+)/);
  return match ? match[1] : null;
}

function getChatGPTConversationId(pathname) {
  const match = pathname.match(/\/c\/([^/]+)/);
  return match ? match[1] : null;
}

function isSupportedChatPage(hostname, pathname) {
  if (hostname === 'claude.ai') {
    return getClaudeConversationId(pathname) !== null;
  }

  if (hostname === 'chatgpt.com' || hostname === 'chat.openai.com') {
    return getChatGPTConversationId(pathname) !== null;
  }

  return false;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getClaudeConversationId,
    getChatGPTConversationId,
    isSupportedChatPage,
  };
}

if (typeof window !== 'undefined') {
  window.AIChatExportRouteUtils = {
    getClaudeConversationId,
    getChatGPTConversationId,
    isSupportedChatPage,
  };
}
