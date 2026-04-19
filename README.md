# FLOW · time.tobislab.com

A minimalist focus companion by **Tobis Lab**.
Timeless quotes · time-slot voice (Serena / Kate) · ambient music · PWA.

**Live**: https://time.tobislab.com

---

## 구조

```
99_deploy/
├── index.html            # v24 본체 (single-file HTML, ~260KB)
├── _headers              # Netlify 캐시·보안 정책
├── manifest.webmanifest  # PWA 매니페스트
├── og.png                # SNS 공유 썸네일 1200×630
├── icon-512.png          # PWA 대형 아이콘
├── icon-192.png          # PWA 표준 아이콘
└── icon-32.png           # 파비콘
```

## 배포 (GitHub → Netlify 자동)

1. 파일 수정
2. `git add . && git commit -m "변경 사항" && git push`
3. Netlify가 자동으로 감지하고 30초 내 `time.tobislab.com`에 반영

## 규범

- 비례 **10:55:30:5** (상단 / 본문 / 여백 / 하단)
- 톤 7단계 투명도 (1.0 / 0.85 / 0.75 / 0.65 / 0.55 / 0.35 / 0.30)
- Pill Consistency: 모든 컨트롤 `border-radius: 100px`
- 시계 UI 변경·명언 주연 침해 금지

## 버전 이력

- **v24** (2026-04-18) · Tobis Originals 10개 추가 (ID 626-635, 6 time slots)
- **v23** (2026-04-18) · OG + PWA + Plausible + CTA
- **v22** (2026-04-18) · 2-Voice 자동 슬롯 매핑 (Serena / Kate)
- **v21** (2026-04-18) · BETA 배지 · Pill consistency · 플레이 톤 0.65
- **v18.5** (2026-04-18) · Nature 그라데이션 (이전 라이브)

## License

© Tobis Lab. All rights reserved.
