import styled from "styled-components";

export const TodoWrapper = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    font-weight: 700;
    margin-bottom: 20px;
  }

  .todo-input {
    margin-bottom: 24px;
  }

  .ant-list {
    background-color: #fafafa;
    border-radius: 8px;
    border: none;
  }

  .ant-list-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: none;
    .ant-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f0f2f5;
      font-weight: 700;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      transition: background-color 0.3s;
      cursor: pointer;
      .ant-list-item-action {
        li {
          padding-left: 0;
        }
      }
      .ant-input {
        background: transparent;
        border: none;
        border-bottom: 1px solid #40a9ff;
        padding-left: 3px;
        &:focus {
          box-shadow: none;
          border-bottom: 1px solid #40a9ff;
        }
        &:hover {
          box-shadow: none;
          border-bottom: 1px solid #40a9ff;
        }
      }

      .ant-btn {
        margin-left: 8px;
      }
    }
  }
`;
