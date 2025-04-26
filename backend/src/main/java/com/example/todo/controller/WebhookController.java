package com.example.todo.controller;

import com.example.todo.entity.Schedule;
import com.example.todo.repository.ScheduleRepository;
import com.example.todo.service.KeywordService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);

    private final ScheduleRepository scheduleRepository;
    private final KeywordService keywordService;

    @PostMapping("/message")
    public ResponseEntity<?> receiveMessage(@RequestBody Map<String, Object> payload) {
        try {
            // 📌 사용자 메시지 추출
            Map<String, Object> userRequest = (Map<String, Object>) payload.get("userRequest");
            String utterance = (String) userRequest.get("utterance");

            String[] lines = utterance.split("\n");

            String date = "";
            String content = "";
            int priorityLevel = 2;
            String keyword = "";

            // 📌 각 줄에서 키-값 파싱
            for (String line : lines) {
                if (line.startsWith("일시:")) {
                    date = line.replace("일시:", "").trim();
                } else if (line.startsWith("할일:")) {
                    content = line.replace("할일:", "").trim();
                } else if (line.startsWith("중요도:")) {
                    try {
                        priorityLevel = Integer.parseInt(line.replace("중요도:", "").trim());
                    } catch (NumberFormatException e) {
                        priorityLevel = 2;
                    }
                } else if (line.startsWith("키워드:")) {
                    keyword = line.replace("키워드:", "").trim();
                }
            }

            // 📌 키워드 없으면 AI 추출
            if (keyword.isBlank() && !content.isBlank()) {
                keyword = keywordService.getKeyword(content);
            }

            // 📌 저장
            Schedule schedule = new Schedule();
            schedule.setDate(date);
            schedule.setContent(content);
            schedule.setPriorityLevel(priorityLevel);
            schedule.setKeyword(keyword);

            scheduleRepository.save(schedule);

            // 📌 응답
            String responseMessage = String.format("'%s' 일정이 %s (중요도 %d, 키워드: %s)로 등록되었어요!",
                    content, date, priorityLevel, keyword);

            Map<String, Object> response = Map.of(
                    "version", "2.0",
                    "template", Map.of(
                            "outputs", List.of(
                                    Map.of("simpleText", Map.of("text", responseMessage))
                            )
                    )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 메시지 처리 중 오류 발생: {}", e.getMessage());

            Map<String, Object> errorResponse = Map.of(
                    "version", "2.0",
                    "template", Map.of(
                            "outputs", List.of(
                                    Map.of("simpleText", Map.of("text", "❗ 일정을 처리하는 중 오류가 발생했어요. 다시 시도해 주세요."))
                            )
                    )
            );
            return ResponseEntity.ok(errorResponse);
        }
    }

    @PostMapping("/today")
    public ResponseEntity<?> getTodaySchedules() {
        String today = LocalDate.now().toString();
        List<Schedule> schedules = scheduleRepository.findByDate(today);

        String message;
        if (schedules.isEmpty()) {
            message = "오늘 등록된 일정이 없어요.";
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append("📅 오늘 일정 목록입니다:\n");
            for (Schedule s : schedules) {
                sb.append("- ")
                  .append(s.getContent())
                  .append(" (중요도 ").append(s.getPriorityLevel())
                  .append(", 키워드: ").append(s.getKeyword())
                  .append(")\n");
            }
            message = sb.toString().trim();
        }

        Map<String, Object> response = Map.of(
                "version", "2.0",
                "template", Map.of(
                        "outputs", List.of(
                                Map.of("simpleText", Map.of("text", message))
                        )
                )
        );

        return ResponseEntity.ok(response);
    }
}