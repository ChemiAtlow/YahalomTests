import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import { NavBar, ProtectedRoute, NestedRoutes } from "./components";
import { Home, Login, Questions, Reports, Restore, Tests } from "./views";
import { ModalProvider } from "./hooks";

const App: React.FC = () => {
    return (
        <ModalProvider>
            <BrowserRouter>
                <ProvideAuth>
                    <NavBar />
                    <main className="app">
                        <Switch>
                            <Route path={["/login", "/signup"]} component={Login} />
                            <Route path="/reset/:token?" component={Restore} />
                            <ProtectedRoute setsField path="/:organizationId/:fieldId">
                                <NestedRoutes>
                                    <ProtectedRoute requiresField path="/questions" component={Questions} />
                                    <ProtectedRoute requiresField path="/tests" component={Tests} />
                                    <ProtectedRoute requiresField path="/reports" component={Reports} />
                                </NestedRoutes>
                            </ProtectedRoute>
                            <ProtectedRoute path="/" component={Home} />
                        </Switch>
                    </main>
                </ProvideAuth>
            </BrowserRouter>
        </ModalProvider>
    );
};

export default App;
