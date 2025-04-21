package com.example.todo.controller;

import com.example.todo.entity.Schedule;
import com.example.todo.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
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
        if (date != null && !date.isEmpty()) {
            return scheduleRepository.findByDate(date);
        } else {
            return scheduleRepository.findAll();
        }
    }

    @PutMapping("/{id}")
    public Schedule updateSchedule(@PathVariable Long id, @RequestBody Schedule updatedSchedule) {
        return scheduleRepository.findById(id)
            .map(schedule -> {
                schedule.setContent(updatedSchedule.getContent());
                schedule.setDate(updatedSchedule.getDate());
                return scheduleRepository.save(schedule);
            })
        .orElseThrow(() -> new RuntimeException("스케줄아이디 " + id));
    }

    @PostMapping
    public Schedule addSchedule(@RequestBody Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleRepository.deleteById(id);
    }
}