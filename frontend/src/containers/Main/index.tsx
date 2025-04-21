import { useState } from "react";
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
  const grouped = allSchedules.reduce<Record<string, string[]>>((acc, cur) => {
    if (!acc[cur.date]) acc[cur.date] = [];
    acc[cur.date].push(cur.content);
    return acc;
  }, {});

  const dateCellRender = (value: moment.Moment) => {
    const dateStr = value.format("YYYY-MM-DD");
    const contents = grouped[dateStr];

    if (!contents || contents.length === 0) return null;

    const maxDisplay = 5; // 최대 표시 항목 수
    const showMore = contents.length > maxDisplay;

    return (
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {contents.slice(0, maxDisplay).map((c, i) => (
          <li
            className="date-cell-conetent"
            key={i}
            style={{
              fontSize: 12,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            - {c}
          </li>
        ))}
        {showMore && (
          <li style={{ fontSize: 12, color: "#999" }}>
            + {contents.length - maxDisplay}개 더보기
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
            {selectedDaySchedules.length > 0 ? (
              <ul>
                오늘의 할일은
                {selectedDaySchedules.map((s, i) => (
                  <li key={i}>{s.content}</li>
                ))}
                입니다
              </ul>
            ) : (
              <p>오늘 할일은 없습니다.</p>
            )}
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
              </div>
            );
          }}
        />
      </Content>
    </MainWrapper>
  );
};

export default MainPage;
