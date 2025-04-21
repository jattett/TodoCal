import { useState } from "react";
import { useParams } from "react-router-dom";
import { List, Button, Typography, Input, message } from "antd";
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

const { Title } = Typography;

const TodoPage = () => {
  const { date } = useParams();
  const { data: schedules, isLoading } = useSchedulesByDate(date || "");

  const addSchedule = useAddSchedule();
  const deleteSchedule = useDeleteSchedule();
  const updateSchedule = useUpdateSchedule();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const handleAdd = (content: string) => {
    if (!date) return;
    addSchedule.mutate(
      { date, content },
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

  const handleEditStart = (item: { id: number; content: string }) => {
    setEditingId(item.id);
    setEditingText(item.content);
  };

  const handleEditSave = () => {
    if (!date || editingId === null) return;
    updateSchedule.mutate(
      { id: editingId, date, content: editingText },
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

  return (
    <TodoWrapper>
      <Title level={3}>{date} 일정 관리</Title>

      <TodoInput onAdd={handleAdd} />

      {isLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <List
          bordered
          dataSource={schedules}
          renderItem={(item) => (
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
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onPressEnter={handleEditSave}
                />
              ) : (
                item.content
              )}
            </List.Item>
          )}
        />
      )}
    </TodoWrapper>
  );
};

export default TodoPage;
