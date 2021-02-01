import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import { NavBar, ProtectedRoute, NestedRoutes, Loader, ErrorBoundary } from "./components";
import { LoadingProvider, ModalProvider } from "./hooks";
import { Suspense } from "react";
import { Exam, Home, Login, Questions, Reports, Restore, Tests } from "./views";

const App: React.FC = () => {
    return (
        <ModalProvider>
            <BrowserRouter>
                <ProvideAuth>
                    <NavBar />
                    <main className="app">
                        <LoadingProvider>
                            <ErrorBoundary>
                                <Suspense fallback={<Loader />}>
                                    <Switch>
                                        <Route path={["/login", "/signup"]} component={Login} />
                                        <Route path="/reset/:token?" component={Restore} />
                                        <Route path="/exam/:testId" component={Exam} />
                                        <ProtectedRoute setsField path="/:organizationId/:fieldId">
                                            <NestedRoutes>
                                                <ProtectedRoute requiresField path="/questions" component={Questions} />
                                                <ProtectedRoute requiresField path="/tests" component={Tests} />
                                                <ProtectedRoute requiresField path="/reports">
                                                    <NestedRoutes>
                                                        <ProtectedRoute requiresField path="/student" component={Reports} />
                                                        <ProtectedRoute requiresField path="/test" component={Reports} />
                                                    </NestedRoutes>
                                                </ProtectedRoute>
                                            </NestedRoutes>
                                        </ProtectedRoute>
                                        <ProtectedRoute path="/" component={Home} />
                                    </Switch>
                                </Suspense>
                            </ErrorBoundary>
                        </LoadingProvider>
                    </main>
                </ProvideAuth>
            </BrowserRouter>
        </ModalProvider>
    );
};

export default App;
