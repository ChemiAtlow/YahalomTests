import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import { NavBar, ProtectedRoute, NestedRoutes, Loader, ErrorBoundary } from "./components";
import { LoadingProvider, ModalProvider } from "./hooks";
import { Suspense } from "react";
import { Exam, Home, Login, Questions, Reports, Restore, Tests } from "./views";

const App: React.FC = () => {
    return (
        <LoadingProvider>
            <ModalProvider>
                <BrowserRouter>
                    <ProvideAuth>
                        <NavBar />
                        <main className="app">
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
                                                <ProtectedRoute requiresField path="/reports" component={Reports} />
                                            </NestedRoutes>
                                        </ProtectedRoute>
                                        <ProtectedRoute path="/" component={Home} />
                                    </Switch>
                                </Suspense>
                            </ErrorBoundary>
                        </main>
                    </ProvideAuth>
                </BrowserRouter>
                </ModalProvider>
            </LoadingProvider>
    );
};

export default App;
