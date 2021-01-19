import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import { NavBar, ProtectedRoute } from "./components";
import { Home, Login, Questions, Reports, Tests } from "./views";

const App: React.FC = () => {
	return (
		<ProvideAuth>
			<BrowserRouter>
				<NavBar />
				<main className="app">
					<Switch>
						<ProtectedRoute path="/questions">
							<Questions />
						</ProtectedRoute>
						<ProtectedRoute path="/tests">
							<Tests />
						</ProtectedRoute>
						<ProtectedRoute path="/reports">
							<Reports />
						</ProtectedRoute>
						<Route path={["/login", "/signup"]}>
							<Login />
						</Route>
						<ProtectedRoute path="/">
							<Home />
						</ProtectedRoute>
					</Switch>
				</main>
			</BrowserRouter>
		</ProvideAuth>
	);
};

export default App;
