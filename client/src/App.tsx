import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import NavBar from "./components/NavBar/NavBar";
import PrivateRoute from "./components/privateRoute";
import { Home, Login, Questions, Reports, Tests } from "./views";

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
						<Route path={["/login", "/signup"]}>
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
