import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import NavBar from "./components/NavBar/NavBar";
import PrivateRoute from "./components/privateRoute";
import Questions from "./views/Questions";
import Tests from "./views/Tests";
import Reports from "./views/Reports";
import Login from "./views/Login";
import Home from "./views/Home";

const App: React.FC = () => {
	return (
		<ProvideAuth>
			<BrowserRouter>
				<NavBar />
				<div className="app">
					<Switch>
						<PrivateRoute path="/questions">
							<Questions />
						</PrivateRoute>
						<PrivateRoute path="/tests">
							<Tests />
						</PrivateRoute>
						<PrivateRoute path="/reports">
							<Reports />
						</PrivateRoute>
						<Route path="/login">
							<Login />
						</Route>
						<PrivateRoute path="/">
							<Home />
						</PrivateRoute>
					</Switch>
				</div>
			</BrowserRouter>
		</ProvideAuth>
	);
};

export default App;
