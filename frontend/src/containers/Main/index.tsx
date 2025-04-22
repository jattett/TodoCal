import { useState, useMemo } from "react";
import { Calendar, Layout, Select } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { MainWrapper } from "./Styled";
import { useAllSchedules, useSchedulesByDate } from "../../store/useSchedules";

moment.locale("ko");
const { Content } = Layout;

const MainPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [selectedKeyword, setSelectedKeyword] = useState<string | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const selectedDateStr = selectedDate?.format("YYYY-MM-DD") || "";

  // 📌 전체 일정 (캘린더용)
  const { data: allSchedules = [] } = useAllSchedules();

  // 📌 선택된 날짜의 일정 (상세용)
  const { data: selectedDaySchedules = [] } =
    useSchedulesByDate(selectedDateStr);

  // 📌 날짜 선택 시
  const onSelectDate = (value: moment.Moment) => {
    setSelectedDate(value);
  };

  // 📌 날짜별 일정 매핑
  const grouped = useMemo(() => {
    const result: Record<string, { content: string; level: number }[]> = {};
  
    allSchedules.forEach((cur) => {
      if (selectedKeyword && cur.keyword !== selectedKeyword) return; // 키워드 필터링
  
      if (!result[cur.date]) result[cur.date] = [];
      result[cur.date].push({
        content: cur.content,
        level: cur.priorityLevel || 1,
      });
    });
  
    return result;
  }, [allSchedules, selectedKeyword]);

  const keywords = useMemo(() => {
    if (!allSchedules) return [];
    return Array.from(
      new Set(allSchedules.map((s: Schedule) => s.keyword).filter(Boolean))
    );
  }, [allSchedules]);


  const dateCellRender = (value: moment.Moment) => {
    const dateStr = value.format("YYYY-MM-DD");
    let items = grouped[dateStr];
  
    if (!items || items.length === 0) return null;
  
    // 🔽 필터된 데이터
    if (selectedLevel !== null) {
      items = items.filter((item) => item.level === selectedLevel);
    }
  
    if (items.length === 0) return null;
  
    const maxDisplay = 5;
    const showMore = items.length > maxDisplay;
  
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {items.slice(0, maxDisplay).map((item, i) => {
          let color = "inherit";
          if (item.level === 3) color = "red";
          else if (item.level === 2) color = "blue";
  
          return (
            <li
              key={i}
              className="date-cell-content"
              style={{
                fontSize: 12,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color,
              }}
            >
              - {item.content} {item.level === 3 && <strong>*중요*</strong>}
            </li>
          );
        })}
  
        {showMore && (
          <li style={{ fontSize: 12, color: "#999" }}>
            + {items.length - maxDisplay}개 더보기
          </li>
        )}
      </ul>
    );
  };
  

  return (
    <MainWrapper>
      <Content style={{ padding: 40, background: "white" }}>
        {selectedDate && (
          <div className="selected-date">
            <h1>선택한 날짜: {selectedDate.format("YYYY년 MM월 DD일")}</h1>

            {/* 🔽 선택한 키워드 있을 경우 필터링 */}
            {(() => {
              const filteredDaySchedules = selectedKeyword
                ? selectedDaySchedules.filter((s) => s.keyword === selectedKeyword)
                : selectedDaySchedules;

              return filteredDaySchedules.length > 0 ? (
                <ul>
                  오늘의 할일은
                  {filteredDaySchedules.map((s, i) => {
                    let color = "inherit";

                    if (s.priorityLevel === 3) {
                      color = "red";
                    } else if (s.priorityLevel === 2) {
                      color = "blue";
                    }

                    return (
                      <li key={i} style={{ color }}>
                        {s.content}
                      </li>
                    );
                  })}
                  입니다
                </ul>
              ) : (
                <p>오늘 할일은 없습니다.</p>
              );
            })()}

            <button
              onClick={() =>
                navigate(`/todo/${selectedDate.format("YYYY-MM-DD")}`)
              }
            >
              상세 보기
            </button>
          </div>
        )}

        {/* 캘린더 */}
        <Calendar
          fullscreen
          defaultValue={moment()} // ✅ 오늘 날짜로 초기 표시
          value={selectedDate} // ✅ 선택된 날짜 하이라이트
          onSelect={onSelectDate}
          dateCellRender={dateCellRender}
          headerRender={({ value, onChange }) => {
            const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
            const months = Array.from({ length: 12 }, (_, i) => i);

            return (
            <div className="header-content">
              <div style={{ display: "flex", alignItems: "center", gap: 12, width: '100%' }}>
                <span
                  onClick={() => setSelectedLevel(3)}
                  style={{ color: "red", cursor: "pointer", fontWeight: selectedLevel === 3 ? "bold" : "normal" }}
                >
                  ● 중요
                </span>
                <span
                  onClick={() => setSelectedLevel(2)}
                  style={{ color: "blue", cursor: "pointer", fontWeight: selectedLevel === 2 ? "bold" : "normal" }}
                >
                  ● 중간
                </span>
                <span
                  onClick={() => setSelectedLevel(1)}
                  style={{ color: "black", cursor: "pointer", fontWeight: selectedLevel === 1 ? "bold" : "normal" }}
                >
                  ● 낮음
                </span>
                <span
                  onClick={() => setSelectedLevel(null)}
                  style={{ marginLeft: 16, cursor: "pointer", color: "gray", textDecoration: selectedLevel === null ? "underline" : "none" }}
                >
                  전체 보기
                </span>
              </div>
              <div className="ant-picker-header-date">
                <Select
                  value={value.year()}
                  onChange={(year: number) => {
                    onChange(value.clone().year(year));
                  }}
                >
                  {years.map((year) => (
                    <Select.Option key={year} value={year}>
                      {year}년
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  value={value.month()}
                  onChange={(month: number) => {
                    onChange(value.clone().month(month));
                  }}
                >
                  {months.map((m) => (
                    <Select.Option key={m} value={m}>
                      {m + 1}월
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  placeholder="키워드 선택"
                  value={selectedKeyword}
                  onChange={(keyword) => setSelectedKeyword(keyword)}
                  allowClear
                >
                  {keywords.map((keyword) => (
                    <Select.Option key={keyword} value={keyword}>
                      {keyword}
                    </Select.Option>
                  ))}
              </Select>
              </div>
            </div>
             
            );
          }}
        />
      </Content>
    </MainWrapper>
  );
};

export default MainPage;
