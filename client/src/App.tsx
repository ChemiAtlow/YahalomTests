import { BrowserRouter, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import { NavBar, ProtectedRoute, NestedRoutes } from "./components";
import { Home, Login, Questions, Reports, Tests } from "./views";

const App: React.FC = () => {
	return (
		<ProvideAuth>
			<BrowserRouter>
				<NavBar />
				<main className="app">
					<Switch>
						<ProtectedRoute
							requiresField
							path="/:organizationId/:fieldId">
							<NestedRoutes>
								<ProtectedRoute requiresField path="/questions">
									<Questions />
								</ProtectedRoute>
								<ProtectedRoute requiresField path="/tests">
									<Tests />
								</ProtectedRoute>
								<ProtectedRoute requiresField path="/reports">
									<Reports />
								</ProtectedRoute>
							</NestedRoutes>
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
