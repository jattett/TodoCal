import { Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { TodoDetailWrapper } from "./Styled";

interface Props {
  onAdd: (content: string) => void;
}

const TodoInput = ({ onAdd }: Props) => {
  const { control, handleSubmit, reset } = useForm<{ content: string }>();

  const onSubmit = (data: { content: string }) => {
    if (!data.content?.trim()) return;
    onAdd(data.content.trim());
    reset();
  };

  return (
    <TodoDetailWrapper>
      <form className="todo-form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="content"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="할 일을 입력하세요" />
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
