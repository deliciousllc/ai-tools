// Claude Chat Transcript Exporter
// Bookmarklet: exports the current Claude.ai conversation as a Markdown file with YAML frontmatter.
// Run on any https://claude.ai/chat/{id} page while logged in.

(async () => {

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Normalize a single message object into a Markdown string.
   * Returns null if the message produces no visible content.
   */
  function normalizeMessage(message) {
    const lines = [];

    for (const block of message.content || []) {
      if (block.type === 'thinking') {
        // Skip internal reasoning blocks
        continue;
      } else if (block.type === 'text') {
        lines.push(block.text);
      } else if (block.type === 'tool_use') {
        lines.push(`[Tool call: ${block.name}]`);
      } else if (block.type === 'tool_result') {
        lines.push(`[Tool result: ${block.name}]`);
      } else {
        lines.push(`[${block.type} block]`);
      }
    }

    const body = lines.join('\n\n').trim();
    return body.length > 0 ? body : null;
  }

  /**
   * Convert a conversation title to a PascalCase_Underscored slug.
   * Example: "GI symptoms and bile acid analysis" → "GI_Symptoms_And_Bile_Acid_Analysis"
   */
  function toSlug(title) {
    return (title || '')
      .replace(/[^a-zA-Z0-9 ]/g, '')   // strip non-alphanumeric (keep spaces)
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // title-case each word
      .join('_');
  }

  /**
   * Trigger a file download in the browser.
   */
  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------------------
  // Main logic
  // ---------------------------------------------------------------------------

  try {

    // 1. Extract conversation ID from URL (/chat/{id})
    const conversationMatch = location.pathname.match(/\/chat\/([^/]+)/);
    if (!conversationMatch) {
      alert('Not on a Claude.ai conversation page.');
      return;
    }
    const conversationId = conversationMatch[1];

    // 2. Extract org ID from lastActiveOrg cookie (fallback: URL /organization/{id})
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

    // 3. Fetch conversation from API
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

    // 4. Normalize messages and build Markdown sections
    const sections = [];
    for (const msg of rawMessages) {
      const role = msg.sender === 'human' ? 'Human' : 'Assistant';
      const body = normalizeMessage(msg);
      if (body !== null) {
        sections.push(`## ${role}\n\n${body}`);
      }
    }
    if (sections.length === 0) {
      alert('No messages found in this conversation.');
      return;
    }

    // 5. Prompt for date and slug
    const today = new Date().toISOString().slice(0, 10);
    const title = data.name || '';
    const defaultSlug = toSlug(title);

    const userDate = prompt('Date (YYYY-MM-DD):', today);
    if (userDate === null) return;  // cancelled

    const userSlug = prompt('Slug:', defaultSlug);
    if (userSlug === null) return;  // cancelled

    // 6. Build YAML frontmatter
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

    // 7. Assemble the full Markdown document
    const markdown = `${frontmatter}\n\n${sections.join('\n\n')}\n`;

    // 8. Download the file
    const filename = `${userDate}_Chat_Transcript_${userSlug}.md`;
    downloadFile(filename, markdown);

  } catch (err) {
    alert(`Export failed: ${err.message}`);
  }

})();
