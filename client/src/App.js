import { BrowserRouter as Router, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import MenuBar from "./components/MenuBar";
import { Container } from "semantic-ui-react";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
