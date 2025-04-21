import styled from "styled-components";

export const TodoDetailWrapper = styled.div`
  display: flex;
  gap: 10px;
  .todo-form {
    width: 100%;
    align-items: center;
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    input {
      border-radius: 8px;
      height: 42px;
    }
    .ant-btn {
      border-radius: 8px;
      height: 42px;
    }
  }
`;
