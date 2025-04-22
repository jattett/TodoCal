package com.example.todo;

import com.example.todo.entity.Schedule;
import com.example.todo.repository.ScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @BeforeEach
    void setup() {
        scheduleRepository.deleteAll();
    }

    @Test
    @DisplayName("일정 생성 API 테스트")
    void testAddSchedule() throws Exception {
        String json = """
            {
              "date": "2025-04-25",
              "content": "테스트 일정",
              "priorityLevel": 2,
              "keyword": "테스트"
            }
        """;

        mockMvc.perform(post("/schedules")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", is("테스트 일정")))
                .andExpect(jsonPath("$.priorityLevel", is(2)))
                .andExpect(jsonPath("$.keyword", is("테스트")));
    }

    @Test
    @DisplayName("전체 일정 조회 API 테스트")
    void testGetSchedules() throws Exception {
        Schedule schedule = new Schedule(null, "2025-04-25", "조회 테스트", 1, "조회");
        scheduleRepository.save(schedule);

        mockMvc.perform(get("/schedules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].content", is("조회 테스트")));
    }

    @Test
    @DisplayName("일정 수정 API 테스트")
    void testUpdateSchedule() throws Exception {
        Schedule schedule = scheduleRepository.save(new Schedule(null, "2025-04-25", "수정 전", 1, "기존"));

        String json = """
            {
              "date": "2025-04-26",
              "content": "수정 후",
              "priorityLevel": 3,
              "keyword": "수정"
            }
        """;

        mockMvc.perform(put("/schedules/" + schedule.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", is("수정 후")))
                .andExpect(jsonPath("$.priorityLevel", is(3)))
                .andExpect(jsonPath("$.keyword", is("수정")));
    }

    @Test
    @DisplayName("일정 삭제 API 테스트")
    void testDeleteSchedule() throws Exception {
        Schedule schedule = scheduleRepository.save(new Schedule(null, "2025-04-25", "삭제 테스트", 1, "삭제"));

        mockMvc.perform(delete("/schedules/" + schedule.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/schedules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

	@Test
    public void testGetKeywords() throws Exception {
        mockMvc.perform(get("/schedules/keywords"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThan(0))))  // 키워드 목록이 비어 있지 않음
            .andExpect(jsonPath("$[0]").isString()); // 첫 번째 키워드가 문자열인지 확인
    }
}
