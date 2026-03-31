// ==UserScript==
// @name        AI Chat Export
// @description Export Claude.ai and ChatGPT conversations as Markdown transcript files
// @match       https://claude.ai/chat/*
// @match       https://claude.ai/organization/*/chat/*
// @match       https://chatgpt.com/c/*
// @match       https://chat.openai.com/c/*
// @version     2.0
// @run-at      document-idle
// ==/UserScript==

(function () {
  'use strict';

  // --- Helpers ---

  function formatTimestamp(value) {
    if (!value) return null;
    // Handle both ISO strings (Claude) and Unix floats (ChatGPT)
    const d = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  }

  function localDate(value) {
    if (!value) return null;
    const d = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
  }

  function toSlug(title) {
    return (title || '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('_');
  }

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function getClaudeConversationId(pathname) {
    const match = pathname.match(/(?:^|\/)(?:organization\/[^/]+\/)?chat\/([^/]+)/);
    return match ? match[1] : null;
  }

  function getChatGPTConversationId(pathname) {
    const match = pathname.match(/\/c\/([^/]+)/);
    return match ? match[1] : null;
  }

  function isSupportedChatPage() {
    return detectSite() !== null;
  }

  // --- Site detection ---

  function detectSite() {
    const host = location.hostname;

    if (host === 'claude.ai' && getClaudeConversationId(location.pathname)) {
      return 'claude';
    }

    if ((host === 'chatgpt.com' || host === 'chat.openai.com') && getChatGPTConversationId(location.pathname)) {
      return 'chatgpt';
    }

    return null;
  }

  // --- Claude API ---

  async function fetchClaude() {
    const conversationId = getClaudeConversationId(location.pathname);
    if (!conversationId) throw new Error('Not on a Claude.ai conversation page.');

    let orgId = null;
    const cookieMatch = document.cookie.match(/(?:^|;\s*)lastActiveOrg=([^;]+)/);
    if (cookieMatch) {
      orgId = decodeURIComponent(cookieMatch[1]);
    } else {
      const orgUrlMatch = location.pathname.match(/\/organization\/([^/]+)/);
      if (orgUrlMatch) orgId = orgUrlMatch[1];
    }
    if (!orgId) throw new Error('Could not find org ID. Are you logged into claude.ai?');

    const response = await fetch(
      `https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}`,
      { credentials: 'include' }
    );

    if (response.status === 401 || response.status === 403) {
      throw new Error('Session expired. Please refresh the page and try again.');
    }
    if (!response.ok) {
      throw new Error(`Could not fetch conversation. The API may have changed. (HTTP ${response.status})`);
    }

    const data = await response.json();
    const rawMessages = data.chat_messages || [];
    if (rawMessages.length === 0) throw new Error('No messages found in this conversation.');

    const messages = [];
    for (const msg of rawMessages) {
      const text = (msg.text || '').trim();
      if (!text) continue;
      messages.push({
        role: msg.sender === 'human' ? 'Human' : 'Assistant',
        text: text,
        timestamp: msg.created_at,
      });
    }

    return {
      conversationId,
      title: data.name || '',
      source: 'claude.ai',
      messages,
      firstTimestamp: rawMessages[0]?.created_at,
    };
  }

  // --- ChatGPT API ---

  async function fetchChatGPT() {
    const conversationId = getChatGPTConversationId(location.pathname);
    if (!conversationId) throw new Error('Not on a ChatGPT conversation page.');

    // Get access token
    const sessionResp = await fetch('https://chatgpt.com/api/auth/session', { credentials: 'include' });
    if (!sessionResp.ok) throw new Error('Could not fetch session. Are you logged into ChatGPT?');
    const sessionData = await sessionResp.json();
    const accessToken = sessionData.accessToken;
    if (!accessToken) throw new Error('No access token found. Please refresh and try again.');

    // Fetch conversation
    const response = await fetch(
      `https://chatgpt.com/backend-api/conversation/${conversationId}`,
      {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    );

    if (response.status === 401 || response.status === 403) {
      throw new Error('Session expired. Please refresh the page and try again.');
    }
    if (!response.ok) {
      throw new Error(`Could not fetch conversation. The API may have changed. (HTTP ${response.status})`);
    }

    const data = await response.json();
    const mapping = data.mapping;
    if (!mapping) throw new Error('No messages found in this conversation.');

    // Walk the tree from current_node to root, then reverse
    const linearMessages = [];
    let nodeId = data.current_node;
    while (nodeId) {
      const node = mapping[nodeId];
      if (!node) break;
      const msg = node.message;
      if (msg && (msg.author.role === 'user' || msg.author.role === 'assistant')) {
        const parts = msg.content?.parts || [];
        // Extract text parts only (skip image objects, etc.)
        const textParts = parts.filter(p => typeof p === 'string');
        const text = textParts.join('\n\n').trim();
        if (text) {
          linearMessages.push({
            role: msg.author.role === 'user' ? 'Human' : 'Assistant',
            text: text,
            timestamp: msg.create_time,
          });
        }
      }
      nodeId = node.parent;
    }
    linearMessages.reverse();

    if (linearMessages.length === 0) throw new Error('No messages found in this conversation.');

    return {
      conversationId,
      title: data.title || '',
      source: 'chatgpt.com',
      messages: linearMessages,
      firstTimestamp: linearMessages[0]?.timestamp,
    };
  }

  // --- Export logic ---

  async function exportChat() {
    try {
      const site = detectSite();
      if (!site) {
        alert('Not on a supported chat page.');
        return;
      }

      const conversation = site === 'claude' ? await fetchClaude() : await fetchChatGPT();

      const sections = [];
      for (const msg of conversation.messages) {
        const ts = formatTimestamp(msg.timestamp);
        const header = ts ? `## ${msg.role}\n*${ts}*` : `## ${msg.role}`;
        sections.push(`${header}\n\n${msg.text}`);
      }

      const today = new Date().toISOString().slice(0, 10);
      const defaultDate = localDate(conversation.firstTimestamp) || today;
      const defaultSlug = toSlug(conversation.title);

      const userDate = (prompt('Date (YYYY-MM-DD):', defaultDate) || '').replace(/[\n\r]/g, '');
      if (!userDate) return;

      const userSlug = (prompt('Slug:', defaultSlug) || '').replace(/[\n\r]/g, '');
      if (!userSlug) return;

      const frontmatter = [
        '---',
        'type: chat-transcript',
        `source: ${conversation.source}`,
        `conversation_id: ${conversation.conversationId}`,
        `exported: ${today}`,
        `date: ${userDate}`,
        `slug: ${userSlug}`,
        `title: "${conversation.title.replace(/"/g, '\\"')}"`,
        '---',
      ].join('\n');

      const markdown = `${frontmatter}\n\n${sections.join('\n\n')}\n`;
      const filename = `${userDate}_Chat_Transcript_${userSlug}.md`;
      downloadFile(filename, markdown);

    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  }

  // --- Inject button ---

  function injectButton() {
    const btn = document.createElement('button');
    btn.id = 'claude-export-btn';
    btn.textContent = 'Export';
    btn.title = 'Export this conversation as Markdown';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      zIndex: '99999',
      padding: '8px 16px',
      background: '#6c47c9',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      opacity: '0.85',
      transition: 'opacity 0.15s',
    });
    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '0.85');
    btn.addEventListener('click', exportChat);
    document.body.appendChild(btn);
  }

  function removeButton() {
    const existing = document.getElementById('claude-export-btn');
    if (existing) existing.remove();
  }

  function ensureButton() {
    if (!document.body) return;

    if (!isSupportedChatPage()) {
      removeButton();
      return;
    }

    if (!document.getElementById('claude-export-btn')) {
      injectButton();
    }
  }

  let ensureScheduled = false;

  function scheduleEnsureButton() {
    if (ensureScheduled) return;
    ensureScheduled = true;
    requestAnimationFrame(() => {
      ensureScheduled = false;
      ensureButton();
    });
  }

  function installNavigationHooks() {
    const wrapHistoryMethod = (methodName) => {
      const original = history[methodName];
      if (typeof original !== 'function') return;

      history[methodName] = function () {
        const result = original.apply(this, arguments);
        scheduleEnsureButton();
        return result;
      };
    };

    wrapHistoryMethod('pushState');
    wrapHistoryMethod('replaceState');
    window.addEventListener('popstate', scheduleEnsureButton);
    window.addEventListener('pageshow', scheduleEnsureButton);
  }

  function installMutationObserver() {
    const observer = new MutationObserver(() => {
      scheduleEnsureButton();
    });

    const startObserving = () => {
      if (!document.documentElement) return;
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    };

    if (document.documentElement) {
      startObserving();
    } else {
      document.addEventListener('DOMContentLoaded', startObserving, { once: true });
    }
  }

  installNavigationHooks();
  installMutationObserver();

  if (document.body) {
    ensureButton();
  } else {
    document.addEventListener('DOMContentLoaded', ensureButton, { once: true });
  }
})();
