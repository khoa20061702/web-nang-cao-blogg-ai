import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSummarizeRequest,
  calculateWordCount,
  estimateReadTime,
  buildSystemPrompt,
  buildUserPrompt,
} from './summarizeLogic.ts';

test('validateSummarizeRequest rejects non-object or null body', () => {
  const result1 = validateSummarizeRequest(null);
  assert.equal(result1.isValid, false);
  assert.match(result1.error || '', /JSON object/);

  const result2 = validateSummarizeRequest('invalid string');
  assert.equal(result2.isValid, false);
});

test('validateSummarizeRequest rejects missing or non-string content', () => {
  const result = validateSummarizeRequest({ content: 12345 });
  assert.equal(result.isValid, false);
  assert.match(result.error || '', /content/);
});

test('validateSummarizeRequest rejects text shorter than 50 characters', () => {
  const result = validateSummarizeRequest({ content: 'Quá ngắn để tóm tắt' });
  assert.equal(result.isValid, false);
  assert.match(result.error || '', /ngắn/);
});

test('validateSummarizeRequest succeeds with valid Vietnamese blog post', () => {
  const content = 'Trí tuệ nhân tạo đang thay đổi toàn diện bức tranh công nghệ tại Việt Nam trong những năm gần đây, từ tài chính đến y tế.';
  const result = validateSummarizeRequest({
    content,
    title: 'Xu hướng AI tại Việt Nam',
    bulletsCount: 3,
    tone: 'engaging',
    language: 'vi',
  });

  assert.equal(result.isValid, true);
  assert.equal(result.data?.content, content);
  assert.equal(result.data?.title, 'Xu hướng AI tại Việt Nam');
  assert.equal(result.data?.bulletsCount, 3);
  assert.equal(result.data?.tone, 'engaging');
  assert.equal(result.data?.language, 'vi');
});

test('validateSummarizeRequest clamps bullets count within bounds [1, 7]', () => {
  const longText = 'Nội dung bài viết mẫu đầy đủ độ dài để vượt qua kiểm tra giới hạn năm mươi ký tự ban đầu của hệ thống xác thực dữ liệu.';
  const resLow = validateSummarizeRequest({ content: longText, bulletsCount: -5 });
  assert.equal(resLow.isValid, true);
  assert.equal(resLow.data?.bulletsCount, 1);

  const resHigh = validateSummarizeRequest({ content: longText, bulletsCount: 99 });
  assert.equal(resHigh.isValid, true);
  assert.equal(resHigh.data?.bulletsCount, 7);
});

test('calculateWordCount correctly counts words', () => {
  assert.equal(calculateWordCount(''), 0);
  assert.equal(calculateWordCount('   '), 0);
  assert.equal(calculateWordCount('Công nghệ trí tuệ nhân tạo'), 6);
  assert.equal(calculateWordCount('Google Gemini API for Express'), 5);
});

test('estimateReadTime calculates reading duration in minutes', () => {
  assert.equal(estimateReadTime(''), 0);
  const shortText = 'một hai ba bốn năm';
  assert.equal(estimateReadTime(shortText), 1);

  // 400 words should be ~2 minutes
  const words400 = new Array(400).fill('từ').join(' ');
  assert.equal(estimateReadTime(words400), 2);
});

test('buildSystemPrompt generates expected prompt instructions', () => {
  const promptVi = buildSystemPrompt({ bulletsCount: 3, tone: 'formal', language: 'vi' });
  assert.match(promptVi, /3 bullet points/);
  assert.match(promptVi, /Formal/);
  assert.match(promptVi, /tiếng Việt/);

  const promptAuto = buildSystemPrompt({ bulletsCount: 5, tone: 'engaging', language: 'auto' });
  assert.match(promptAuto, /5 bullet points/);
  assert.match(promptAuto, /CRITICAL LANGUAGE RULE/);
});

test('buildUserPrompt attaches article title when present', () => {
  const promptWithTitle = buildUserPrompt('Nội dung bài viết dài...', 'Tiêu đề bài viết');
  assert.match(promptWithTitle, /\[ARTICLE TITLE\]: Tiêu đề bài viết/);
  assert.match(promptWithTitle, /\[ARTICLE BODY\]/);

  const promptWithoutTitle = buildUserPrompt('Chỉ có nội dung bài viết...');
  assert.doesNotMatch(promptWithoutTitle, /\[ARTICLE TITLE\]/);
});
