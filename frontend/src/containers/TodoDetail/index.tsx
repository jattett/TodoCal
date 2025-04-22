import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  List,
  Button,
  Typography,
  Input,
  message,
  Select,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import TodoInput from "../../components/TodoInput";
import {
  useSchedulesByDate,
  useAddSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
} from "../../store/useSchedules";
import { TodoWrapper } from "./Styled";
import type { Schedule } from "../../store/useSchedules";

const { Title } = Typography;
const priorityOptions = [
  { label: "낮음", value: 1, color: "black" },
  { label: "중간", value: 2, color: "blue" },
  { label: "높음", value: 3, color: "red" },
];

const TodoPage = () => {
  const { date } = useParams();
  const { data: schedules, isLoading } = useSchedulesByDate(date || "");

  const addSchedule = useAddSchedule();
  const deleteSchedule = useDeleteSchedule();
  const updateSchedule = useUpdateSchedule();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [editingPriority, setEditingPriority] = useState<number>(1);
  const [editingKeyword, setEditingKeyword] = useState<string>("");

  const handleAdd = (content: string,  priorityLevel: number, keyword: string) => {
    if (!date) return;
    addSchedule.mutate(
      { date, content, priorityLevel, keyword },
      {
        onSuccess: () => {
          message.success("일정이 추가되었습니다!");
        },
        onError: () => {
          message.error("일정 추가에 실패했습니다.");
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteSchedule.mutate(id, {
      onSuccess: () => {
        message.success("일정이 삭제되었습니다!");
      },
      onError: () => {
        message.error("삭제에 실패했습니다.");
      },
    });
  };

  const handleEditStart = (item: Schedule) => {
    setEditingId(item.id);
    setEditingText(item.content);
    setEditingPriority(item.priorityLevel || 1);
  };

  const handleEditSave = () => {
    if (!date || editingId === null) return;
  
    updateSchedule.mutate(
      {
        id: editingId,
        date,
        content: editingText,
        priorityLevel: editingPriority,
        keyword: editingKeyword, 
      },
      {
        onSuccess: () => {
          message.success("수정이 완료되었습니다.");
          setEditingId(null);
          setEditingText("");
        },
        onError: () => {
          message.error("수정을 실패하였습니다.");
        },
      }
    );
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText("");
  };

  const getColorByPriority = (level: number) => {
    return priorityOptions.find((p) => p.value === level)?.color || "gray";
  };

  return (
    <TodoWrapper>
      <Title level={3}>{date} 일정 관리</Title>

      <TodoInput onAdd={handleAdd} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, width:'100%',justifyContent:'flex-end',marginBottom:'10px' }}>
        <span style={{ color: "red" }}>● 중요</span>
        <span style={{ color: "blue" }}>● 중간</span>
        <span style={{ color: "black" }}>● 낮음</span>
      </div>
      {isLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <List
          bordered
          dataSource={schedules}
          renderItem={(item: Schedule) => (
            <List.Item
              actions={
                item.id === editingId
                  ? [
                      <Button
                        type="text"
                        icon={<CheckOutlined />}
                        onClick={handleEditSave}
                      />,
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={handleEditCancel}
                      />,
                    ]
                  : [
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditStart(item)}
                      />,
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item.id)}
                      />,
                    ]
              }
            >
              {item.id === editingId ? (
                <Space>
                  <Input 
                    className="editing-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onPressEnter={handleEditSave}
                    style={{ width: '100%' }}
                  />
                  <Select
                    value={editingPriority}
                    onChange={(val) => setEditingPriority(val)}
                  >
                    {priorityOptions.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Space>
              ) : (
                <span
                  style={{
                    color: getColorByPriority(item.priorityLevel ?? 1),
                    display: "flex",
                    gap: "5px",
                    flexDirection: 'row'
                  }}
                >
                  {item.priorityLevel === 3 && <strong> *중요*</strong>}
                  {item.content}
                </span>
              )}
            </List.Item>
          )}
        />
      )}
    </TodoWrapper>
  );
};

export default TodoPage;
