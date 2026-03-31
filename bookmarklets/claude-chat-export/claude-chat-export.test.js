const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { getClaudeConversationId, isSupportedChatPage } = require('./route-utils.js');

test('extracts Claude conversation ids from both supported route shapes', () => {
  assert.equal(
    getClaudeConversationId('/chat/abc123'),
    'abc123'
  );

  assert.equal(
    getClaudeConversationId('/organization/org_42/chat/def456'),
    'def456'
  );

  assert.equal(
    getClaudeConversationId('/organization/org_42/settings'),
    null
  );
});

test('recognizes supported chat pages across Claude and ChatGPT', () => {
  assert.equal(
    isSupportedChatPage('claude.ai', '/chat/abc123'),
    true
  );

  assert.equal(
    isSupportedChatPage('claude.ai', '/organization/org_42/chat/def456'),
    true
  );

  assert.equal(
    isSupportedChatPage('chatgpt.com', '/c/ghi789'),
    true
  );

  assert.equal(
    isSupportedChatPage('claude.ai', '/recents'),
    false
  );
});

test('userscript metadata matches Claude org-scoped routes', () => {
  const userScript = fs.readFileSync(
    path.join(__dirname, 'Claude Chat Export.user.js'),
    'utf8'
  );

  assert.match(
    userScript,
    /@match\s+https:\/\/claude\.ai\/chat\/\*/
  );

  assert.match(
    userScript,
    /@match\s+https:\/\/claude\.ai\/organization\/\*\/chat\/\*/
  );
});
