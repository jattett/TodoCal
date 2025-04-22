import { Input, Button, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { TodoDetailWrapper } from "./Styled";

interface Props {
  onAdd: (content: string, priorityLevel: number, keyword: string) => void;
}

const priorityOptions = [
  { label: "낮음", value: 1 },
  { label: "중간", value: 2 },
  { label: "높음", value: 3 },
];

const TodoForm = ({ onAdd }: Props) => {
  const { control, handleSubmit, reset } = useForm<{
    content: string;
    priorityLevelId: number;
    keyword: string;
  }>({
    defaultValues: {
      content: "",
      priorityLevelId: 1,
      keyword: "",
    },
  });

  const onSubmit = async (data: {
    content: string;
    priorityLevelId: number;
    keyword: string;
  }) => {
    if (!data.content?.trim()) return;
    await onAdd(data.content.trim(), data.priorityLevelId, data.keyword.trim());
    reset(); // defaultValues로 초기화
  };

  return (
    <TodoDetailWrapper>
      <form
        className="todo-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", gap: "8px" }}
      >
        <div className="input-wrapper">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="할 일을 입력하세요" />
            )}
          />
          <Controller
            name="keyword"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="키워드 (예: 개발, 디자인)" />
            )}
          />
        </div>
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

export default TodoForm;
