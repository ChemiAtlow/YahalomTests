import { BrowserRouter, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import { NavBar, ProtectedRoute, NestedRoutes } from "./components";
import { Home, Login, Questions, Reports, Restore, Tests } from "./views";
import { ModalProvider } from "./hooks";

const App: React.FC = () => {
    return (
        <ModalProvider>
            <ProvideAuth>
                <BrowserRouter>
                    <NavBar />
                    <main className="app">
                        <Switch>
                            <ProtectedRoute onlyNonAuth path={["/login", "/signup"]}>
                                <Login />
                            </ProtectedRoute>
                            <ProtectedRoute onlyNonAuth path="/reset/:token?">
                                <Restore />
                            </ProtectedRoute>
                            <ProtectedRoute requiresField path="/:organizationId/:fieldId">
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
                            <ProtectedRoute path="/">
                                <Home />
                            </ProtectedRoute>
                        </Switch>
                    </main>
                </BrowserRouter>
            </ProvideAuth>
        </ModalProvider>
    );
};

export default App;
