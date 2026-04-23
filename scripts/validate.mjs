#!/usr/bin/env node
// ========================================
// Tobislab FLOW · 배포 전 검증
// - index.html 인라인 스크립트 문법 체크
// - QUOTES 배열 파싱 가능 여부
// - manifest.webmanifest JSON 파싱
// - _headers / sw.js 존재 확인
// ========================================
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const fail = (msg) => { console.error('❌', msg); process.exit(1); };
const ok = (msg) => console.log('✅', msg);

// 1. 필수 파일 존재
for (const f of ['index.html', '_headers', 'manifest.webmanifest', 'sw.js']) {
  const p = new URL(f, root);
  if (!existsSync(p)) fail(`Missing required file: ${f}`);
}
ok('필수 파일 존재');

// 2. manifest JSON 파싱
try {
  const mf = readFileSync(new URL('manifest.webmanifest', root), 'utf8');
  const json = JSON.parse(mf);
  if (!json.name && !json.short_name) fail('manifest: name 필드 없음');
  ok(`manifest.webmanifest 유효 (${json.name || json.short_name})`);
} catch (e) {
  fail(`manifest.webmanifest JSON 파싱 실패: ${e.message}`);
}

// 3. index.html 인라인 스크립트 문법 체크
const html = readFileSync(new URL('index.html', root), 'utf8');
const scriptBlocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1])
  .filter(code => code.trim().length > 0);

if (scriptBlocks.length === 0) fail('인라인 <script> 블록을 찾지 못함');

for (const [idx, code] of scriptBlocks.entries()) {
  try {
    new vm.Script(code);
  } catch (e) {
    fail(`인라인 script #${idx + 1} 문법 오류: ${e.message}`);
  }
}
ok(`인라인 script ${scriptBlocks.length}개 문법 OK`);

// 4. QUOTES 배열 추출 & 파싱
const quotesMatch = html.match(/const\s+QUOTES\s*=\s*(\[[\s\S]*?\]);/);
if (!quotesMatch) fail('QUOTES 배열 선언을 찾지 못함');
try {
  const quotes = JSON.parse(quotesMatch[1]);
  if (!Array.isArray(quotes) || quotes.length === 0) fail('QUOTES 배열이 비어있음');
  const missing = quotes.filter(q => !q.quote_en || !q.author || !q.time_slot);
  if (missing.length > 0) fail(`QUOTES 필수 필드 누락: ${missing.length}개`);
  ok(`QUOTES ${quotes.length}개 유효 (필수 필드 모두 충족)`);
} catch (e) {
  fail(`QUOTES JSON 파싱 실패: ${e.message}`);
}

// 5. _headers 파싱
const headers = readFileSync(new URL('_headers', root), 'utf8');
if (!headers.includes('Content-Security-Policy')) fail('_headers에 CSP 미설정');
if (!headers.includes('X-Content-Type-Options')) fail('_headers에 nosniff 미설정');
ok('_headers 보안 헤더 검증 통과');

// 6. sw.js 기본 체크
const sw = readFileSync(new URL('sw.js', root), 'utf8');
try {
  new vm.Script(sw);
  if (!sw.includes("self.addEventListener('fetch'")) fail('sw.js에 fetch 핸들러 없음');
  ok('sw.js 문법 + fetch 핸들러 OK');
} catch (e) {
  fail(`sw.js 문법 오류: ${e.message}`);
}

console.log('\n🎉 모든 검증 통과');
