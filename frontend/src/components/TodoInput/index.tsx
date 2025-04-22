import { Input, Button, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { TodoDetailWrapper } from "./Styled";

interface Props {
  onAdd: (content: string, priorityLevelId: number) => void;
}

const priorityOptions = [
  { label: "낮음", value: 1 },
  { label: "중간", value: 2 },
  { label: "높음", value: 3 },
];

const TodoInput = ({ onAdd }: Props) => {
  const { control, handleSubmit, reset } = useForm<{
    content: string;
    priorityLevelId: number;
  }>({
    defaultValues: {
      content: "",
      priorityLevelId: 1,
    },
  });

  const onSubmit = (data: { content: string; priorityLevelId: number }) => {
    if (!data.content?.trim()) return;
    onAdd(data.content.trim(), data.priorityLevelId);
    reset(); // reset은 defaultValue로 초기화됨
  };

  return (
    <TodoDetailWrapper>
      <form className="todo-form" onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", gap: "8px" }}>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="할 일을 입력하세요" />
          )}
        />
        <Controller
          name="priorityLevelId"
          control={control}
          render={({ field }) => (
            <Select {...field} style={{ width: 100 }}>
              {priorityOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          )}
        />
        <Button type="primary" htmlType="submit">
          추가
        </Button>
      </form>
    </TodoDetailWrapper>
  );
};

export default TodoInput;
