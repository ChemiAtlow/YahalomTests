import { BrowserRouter, Route, Switch } from "react-router-dom";
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
                            <ProtectedRoute onlyNonAuth path={["/login", "/signup"]} component={Login} />
                            <ProtectedRoute onlyNonAuth path="/reset/:token?" component={Restore} />
                            <ProtectedRoute requiresField path="/:organizationId/:fieldId">
                                <NestedRoutes>
                                    <Route requiresField path="/questions" component={Questions} />
                                    <Route requiresField path="/tests" component={Tests} />
                                    <Route requiresField path="/reports" component={Reports} />
                                </NestedRoutes>
                            </ProtectedRoute>
                            <ProtectedRoute path="/" component={Home} />
                        </Switch>
                    </main>
                </BrowserRouter>
            </ProvideAuth>
        </ModalProvider>
    );
};

export default App;
