import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./containers/Main";
import TodoPage from "./containers/TodoDetail";
import { Layout } from "antd";
import "antd/dist/antd.css"; // Ant Design CSS
import GlobalStyle from "./assets/global-style";


const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {/* 헤더바 */}
        <Header style={{ background: "#001529" }}>
          <div style={{ float: "left", color: "white", fontSize: "20px" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              📝 Todo App
            </Link>
          </div>
        </Header>

        {/* 콘텐츠 영역 */}
        <Content>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/todo/:date" element={<TodoPage />} />
          </Routes>
        </Content>
      </Layout>
      <GlobalStyle />
    </Router>
  );
}

export default App;
