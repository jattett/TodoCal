package com.example.todo.repository;

import com.example.todo.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {


    @Query("SELECT s FROM Schedule s WHERE s.date = :date")
    List<Schedule> findByDate(String date);

    @Query("SELECT DISTINCT s.keyword FROM Schedule s WHERE s.keyword IS NOT NULL")
    List<String> findDistinctKeywords();
}