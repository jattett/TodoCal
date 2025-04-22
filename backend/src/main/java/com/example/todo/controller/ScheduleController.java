package com.example.todo.controller;

import com.example.todo.entity.Schedule;
import com.example.todo.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;

    @GetMapping
    public List<Schedule> getSchedules(@RequestParam(required = false) String date) {
        try {
            if (date != null) {
                System.out.println(">>> 요청 받은 날짜: " + date);
                return scheduleRepository.findByDate(date);
            } else {
                return scheduleRepository.findAll();
            }
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 에러 출력
            throw new RuntimeException("스케줄 조회 중 오류 발생: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addSchedule(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody Schedule payload) {
        return scheduleRepository.findById(id)
                .map(schedule -> {
                    schedule.setContent(payload.getContent());
                    schedule.setDate(payload.getDate());
                    schedule.setPriorityLevel(payload.getPriorityLevel());
                    schedule.setKeyword(payload.getKeyword());
                    return ResponseEntity.ok(scheduleRepository.save(schedule));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleRepository.deleteById(id);
    }

    @GetMapping("/keywords")
    public ResponseEntity<List<String>> getKeywords() {
        try {
            List<String> keywords = scheduleRepository.findDistinctKeywords();
            return ResponseEntity.ok(keywords);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
