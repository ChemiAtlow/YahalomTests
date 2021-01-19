import { BrowserRouter, Switch } from "react-router-dom";
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
						<ProtectedRoute reuqiresField path="/questions">
							<Questions />
						</ProtectedRoute>
						<ProtectedRoute reuqiresField path="/tests">
							<Tests />
						</ProtectedRoute>
						<ProtectedRoute reuqiresField path="/reports">
							<Reports />
						</ProtectedRoute>
						<ProtectedRoute
							onlyNonAuth
							path={["/login", "/signup"]}>
							<Login />
						</ProtectedRoute>
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
