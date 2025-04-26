package com.example.todo.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class KeywordService {

    private static final Logger log = LoggerFactory.getLogger(KeywordService.class);

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
    private static final String API_KEY = "";

    public String getKeyword(String inputText) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 📌 프롬프트 구성 (오타 보정 + 핵심 키워드 한 단어만 요청)
        String prompt = """
            "%s" 이라는 일정 내용에서 핵심 주제를 대표하는 대분류 키워드 하나를 한국어로 추출해줘.
            예를 들어 '헬스장 가기'는 '운동', '마케팅 회의'는 '업무', '치과 진료'는 '건강'처럼.
            오타가 있어도 의미를 파악해서, 딱 1개의 키워드만 응답해. 다른 말은 하지 마.
            """.formatted(inputText.trim());

        // 📌 JSON payload 구성
        String requestJson = String.format("""
        {
          "contents": [
            {
              "parts": [
                {
                  "text": "%s"
                }
              ]
            }
          ]
        }
        """, prompt.replace("\"", "\\\""));  // 이스케이프 처리

        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);
        String url = API_URL + "?key=" + API_KEY;

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            String body = response.getBody();
            log.info("🧠 Gemini 응답 결과: {}", body);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(body);

            String keyword = root.path("candidates")
                                 .get(0)
                                 .path("content")
                                 .path("parts")
                                 .get(0)
                                 .path("text")
                                 .asText()
                                 .replaceAll("[\\n\\r\\s]", "") // 공백, 줄바꿈 제거
                                 .trim();

            return keyword.isEmpty() ? "키워드 생성 실패" : keyword;

        } catch (Exception e) {
            log.error("❌ 키워드 생성 실패: {}", e.getMessage());
            return "키워드 생성 실패";
        }
    }
}