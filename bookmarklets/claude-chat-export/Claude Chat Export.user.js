// ==UserScript==
// @name        Claude Chat Export
// @description Export Claude.ai conversations as Markdown transcript files
// @match       https://claude.ai/chat/*
// @version     1.0
// @run-at      document-idle
// ==/UserScript==

(function () {
  'use strict';

  // Avoid injecting twice
  if (document.getElementById('claude-export-btn')) return;

  // --- Helpers ---

  function getMessageText(message) {
    const text = (message.text || '').trim();
    return text.length > 0 ? text : null;
  }

  function formatTimestamp(isoString) {
    if (!isoString) return null;
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
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

  // --- Export logic ---

  async function exportChat() {
    try {
      const conversationMatch = location.pathname.match(/\/chat\/([^/]+)/);
      if (!conversationMatch) {
        alert('Not on a Claude.ai conversation page.');
        return;
      }
      const conversationId = conversationMatch[1];

      let orgId = null;
      const cookieMatch = document.cookie.match(/(?:^|;\s*)lastActiveOrg=([^;]+)/);
      if (cookieMatch) {
        orgId = decodeURIComponent(cookieMatch[1]);
      } else {
        const orgUrlMatch = location.pathname.match(/\/organization\/([^/]+)/);
        if (orgUrlMatch) orgId = orgUrlMatch[1];
      }
      if (!orgId) {
        alert('Could not find org ID. Are you logged into claude.ai?');
        return;
      }

      const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}`;
      const response = await fetch(apiUrl, { credentials: 'include' });

      if (response.status === 401 || response.status === 403) {
        alert('Session expired. Please refresh the page and try again.');
        return;
      }
      if (!response.ok) {
        alert(`Could not fetch conversation. The API may have changed. (HTTP ${response.status})`);
        return;
      }

      const data = await response.json();
      const rawMessages = data.chat_messages || [];
      if (rawMessages.length === 0) {
        alert('No messages found in this conversation.');
        return;
      }

      const sections = [];
      for (const msg of rawMessages) {
        const role = msg.sender === 'human' ? 'Human' : 'Assistant';
        const body = getMessageText(msg);
        if (body !== null) {
          const ts = formatTimestamp(msg.created_at);
          const header = ts ? `## ${role}\n*${ts}*` : `## ${role}`;
          sections.push(`${header}\n\n${body}`);
        }
      }
      if (sections.length === 0) {
        alert('No messages found in this conversation.');
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const title = data.name || '';
      const defaultSlug = toSlug(title);

      const userDate = (prompt('Date (YYYY-MM-DD):', today) || '').replace(/[\n\r]/g, '');
      if (!userDate) return;

      const userSlug = (prompt('Slug:', defaultSlug) || '').replace(/[\n\r]/g, '');
      if (!userSlug) return;

      const frontmatter = [
        '---',
        'type: chat-transcript',
        'source: claude.ai',
        `conversation_id: ${conversationId}`,
        `exported: ${today}`,
        `date: ${userDate}`,
        `slug: ${userSlug}`,
        `title: "${title.replace(/"/g, '\\"')}"`,
        '---',
      ].join('\n');

      const markdown = `${frontmatter}\n\n${sections.join('\n\n')}\n`;
      const filename = `${userDate}_Chat_Transcript_${userSlug}.md`;
      downloadFile(filename, markdown);

    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  }

  // --- Inject button into Claude UI ---

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

  // Wait for page to be ready, then inject
  if (document.body) {
    injectButton();
  } else {
    document.addEventListener('DOMContentLoaded', injectButton);
  }
})();
