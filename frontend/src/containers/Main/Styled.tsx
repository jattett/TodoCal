import styled from "styled-components";

export const MainWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  .ant-layout-content {
    width: 100%;
    padding: 0px;
    background: white;
    max-width: 1280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 0 auto;
    .selected-date {
      margin-top: 30px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h1 {
        font-weight: 700;
      }
      ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        margin: 0 auto;
        align-items: center;
        justify-content: center;
        li {
          font-size: 18px;
          font-weight: 700;
        }
      }
      button {
        background-color: #1890ff;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        &:hover {
          background-color: #40a9ff;
        }
      }
    }
    .header-content {
      border-top: 1px solid #e9e9e9;
      padding-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ant-picker-header-date {
        display: flex;
        width: 100%;
        padding: 0 16px 8px;
        gap: 8px;
        justify-content: flex-end;
        .ant-select-selector {
          border-radius: 8px;
        }
      }
      .ant-picker-content {
        .date-cell-conetent {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
          font-weight: 700;
        }
      }
    }
    .ant-picker-calendar {
      padding: 40px;
      margin: 0 auto;
    }
  }
  @media screen and (max-width: 650px) {
    .ant-layout-content {
      .ant-picker-calendar {
        padding: 10px;
        margin: 0 auto;
      }
      .header-content {
        flex-direction: column;
        > div {
          &.ant-picker-header-date {
            padding: 0;
          }
          justify-content: flex-end;
          margin-bottom: 10px;
          padding: 0;
        }
      }
    }
  }

  @media screen and (max-width: 420px) {
    .date-cell-content {
      overflow: initial !important;
    }
  }
`;

export const Content = styled.div`
  flex: 1;
  padding: 40px;
  background: white;
  overflow: auto;
`;
