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
    .input-wrapper {
      width: 100%;
      display: flex;
      gap: 5px;
      input {
        border-radius: 8px;
        height: 42px;
      }
    }

    .ant-select-selector {
      height: 42px;
      border-radius: 8px;
      .ant-select-selection-item {
        display: flex;
        align-items: center;
      }
    }
    .ant-btn {
      border-radius: 8px;
      height: 42px;
    }
  }
`;
