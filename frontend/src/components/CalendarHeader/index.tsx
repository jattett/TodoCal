import { Select } from "antd";

interface Props {
  value: moment.Moment;
  onChange: (date: moment.Moment) => void;
  selectedLevel: number | null;
  setSelectedLevel: (level: number | null) => void;
  selectedKeyword?: string;
  setSelectedKeyword: (keyword: string | undefined) => void;
  keywords: string[];
}

const CalendarHeader = ({
  value,
  onChange,
  selectedLevel,
  setSelectedLevel,
  selectedKeyword,
  setSelectedKeyword,
  keywords,
}: Props) => {
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <>
      <div className="header-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
          }}
        >
          <span
            onClick={() => setSelectedLevel(3)}
            style={{
              color: "red",
              cursor: "pointer",
              fontWeight: selectedLevel === 3 ? "bold" : "normal",
            }}
          >
            ● 중요
          </span>
          <span
            onClick={() => setSelectedLevel(2)}
            style={{
              color: "blue",
              cursor: "pointer",
              fontWeight: selectedLevel === 2 ? "bold" : "normal",
            }}
          >
            ● 중간
          </span>
          <span
            onClick={() => setSelectedLevel(1)}
            style={{
              color: "black",
              cursor: "pointer",
              fontWeight: selectedLevel === 1 ? "bold" : "normal",
            }}
          >
            ● 낮음
          </span>
          <span
            onClick={() => setSelectedLevel(null)}
            style={{
              marginLeft: 16,
              cursor: "pointer",
              color: "gray",
              textDecoration: selectedLevel === null ? "underline" : "none",
            }}
          >
            전체 보기
          </span>
        </div>
        <div className="ant-picker-header-date">
          <Select
            value={value.year()}
            onChange={(year) => onChange(value.clone().year(year))}
          >
            {years.map((y) => (
              <Select.Option key={y} value={y}>
                {y}년
              </Select.Option>
            ))}
          </Select>
          <Select
            value={value.month()}
            onChange={(month) => onChange(value.clone().month(month))}
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
            onChange={(val) => setSelectedKeyword(val)}
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
    </>
  );
};

export default CalendarHeader;
